import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Inicializar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
})
const paymentClient = new Payment(client)

// Função para buscar pagamento por external_reference (timelineId)
async function findPaymentByExternalReference(timelineId: string): Promise<any | null> {
  try {
    // Buscar pagamentos usando a API de busca do Mercado Pago
    // Usar external_reference para encontrar o pagamento
    const searchParams = new URLSearchParams({
      external_reference: timelineId,
      sort: 'date_created',
      criteria: 'desc',
    })

    // A API de busca retorna pagamentos relacionados ao external_reference
    // Vamos tentar buscar diretamente usando o SDK
    // Nota: O SDK do Mercado Pago não tem busca direta, então vamos tentar uma abordagem diferente
    
    // Primeiro, vamos tentar buscar pagamentos recentes e filtrar por external_reference
    // Como alternativa, podemos usar a API REST diretamente
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${timelineId}&sort=date_created&criteria=desc`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Erro ao buscar pagamentos:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    
    // Retornar o primeiro pagamento encontrado (mais recente)
    if (data.results && data.results.length > 0) {
      return data.results[0]
    }

    return null
  } catch (error: any) {
    console.error('Erro ao buscar pagamento por external_reference:', error)
    return null
  }
}

// POST - Sincronizar status do pagamento com Mercado Pago
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timelineId = params.id

    // Buscar payment no banco
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('timeline_id', timelineId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Buscar status real do pagamento no Mercado Pago
    let mpPayment = null
    
    // Se o mercado_pago_payment_id é um preference ID, buscar por external_reference
    if (!payment.mercado_pago_payment_id || payment.mercado_pago_payment_id.startsWith('pref-')) {
      console.log('⚠️ mercado_pago_payment_id é preference ID, buscando por external_reference...')
      mpPayment = await findPaymentByExternalReference(timelineId)
      
      if (!mpPayment) {
        return NextResponse.json(
          { 
            error: 'Pagamento não encontrado no Mercado Pago. O webhook pode não ter processado ainda.',
            suggestion: 'Aguarde alguns minutos e tente novamente, ou verifique se o pagamento foi concluído.'
          },
          { status: 404 }
        )
      }
      
      // Atualizar o mercado_pago_payment_id com o ID real do pagamento
      const realPaymentId = mpPayment.id?.toString() || mpPayment.id
      await supabaseAdmin
        .from('payments')
        .update({ mercado_pago_payment_id: realPaymentId })
        .eq('id', payment.id)
      
      console.log('✅ Payment ID atualizado:', realPaymentId)
    } else {
      // Tentar buscar pelo ID do pagamento
      try {
        mpPayment = await paymentClient.get({ id: payment.mercado_pago_payment_id })
      } catch (error: any) {
        console.warn('⚠️ Não foi possível buscar pelo payment ID, tentando por external_reference...', error.message)
        // Se falhar, tentar buscar por external_reference
        mpPayment = await findPaymentByExternalReference(timelineId)
        
        if (!mpPayment) {
          return NextResponse.json(
            { 
              error: 'Erro ao buscar pagamento no Mercado Pago', 
              details: error.message 
            },
            { status: 500 }
          )
        }
        
        // Atualizar o mercado_pago_payment_id
        const realPaymentId = mpPayment.id?.toString() || mpPayment.id
        await supabaseAdmin
          .from('payments')
          .update({ mercado_pago_payment_id: realPaymentId })
          .eq('id', payment.id)
        
        console.log('✅ Payment ID atualizado:', realPaymentId)
      }
    }

    const realStatus = mpPayment.status
    console.log('Status real do pagamento:', realStatus)

    // Atualizar status no banco se mudou
    let updated = false
    if (realStatus === 'approved' && payment.status !== 'succeeded') {
      // Atualizar status do pagamento
      await supabaseAdmin
        .from('payments')
        .update({ status: 'succeeded' })
        .eq('id', payment.id)

      // Publicar timeline se ainda não estiver publicada
      const { data: timeline } = await supabaseAdmin
        .from('timelines')
        .select('is_published, plan_type')
        .eq('id', timelineId)
        .single()

      if (timeline && !timeline.is_published) {
        await supabaseAdmin
          .from('timelines')
          .update({
            plan_type: payment.plan_type,
            is_published: true,
          })
          .eq('id', timelineId)
      }

      updated = true
      console.log('✅ Status atualizado para "succeeded" e timeline publicada')
    } else if (realStatus === 'rejected' || realStatus === 'cancelled' || realStatus === 'refunded') {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id)
      
      updated = true
      console.log('✅ Status atualizado para "failed"')
    }

    return NextResponse.json({
      success: true,
      updated,
      payment: {
        id: payment.id,
        status: realStatus === 'approved' ? 'succeeded' : payment.status,
        mercado_pago_status: realStatus,
      },
    })
  } catch (error: any) {
    console.error('Erro ao sincronizar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

