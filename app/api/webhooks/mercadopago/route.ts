import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Inicializar cliente do Mercado Pago para buscar detalhes do pagamento
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
})
const paymentClient = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== WEBHOOK RECEBIDO ===')
    console.log('Body completo:', JSON.stringify(body, null, 2))
    console.log('Tipo:', body.type)
    console.log('Action:', body.action)
    console.log('Data:', JSON.stringify(body.data, null, 2))
    
    const { type, action, data } = body

    // Extrair paymentId de diferentes formatos de webhook
    let paymentId: string | undefined = undefined
    let paymentStatus: string | undefined = undefined
    
    // Formato 1: body.data.id (webhook padrão do Mercado Pago)
    if (data?.id) {
      paymentId = String(data.id)
      paymentStatus = data.status || action
    }
    // Formato 2: body.id (webhook direto)
    else if (body.id && typeof body.id === 'string') {
      paymentId = String(body.id)
      paymentStatus = body.status || action
    }
    // Formato 3: action contém "payment" e há ID no body
    else if (action && typeof action === 'string' && action.includes('payment')) {
      // Tentar extrair do body diretamente
      paymentId = body.id ? String(body.id) : (body.data?.id ? String(body.data.id) : undefined)
      paymentStatus = body.status || action
    }
    // Formato 4: body pode ter estrutura diferente (tentar buscar em vários lugares)
    else {
      // Tentar encontrar paymentId em diferentes propriedades
      paymentId = body.payment_id || body.paymentId || body.data?.payment_id || body.data?.paymentId
      if (paymentId) {
        paymentId = String(paymentId)
        paymentStatus = body.status || body.data?.status || action
      }
    }

    // Processar notificação de pagamento
    // Aceitar webhooks mesmo se type for undefined, desde que tenha action relacionada a payment ou paymentId
    const isPaymentWebhook = type === 'payment' || 
                             (action && typeof action === 'string' && action.includes('payment')) || 
                             paymentId ||
                             (body.data && (body.data.id || body.data.status))
    
    if (isPaymentWebhook) {
      console.log('Processando pagamento:', {
        paymentId,
        status: paymentStatus,
        type,
        action,
      })

      if (!paymentId) {
        console.error('❌ Payment ID não encontrado no webhook')
        return NextResponse.json({ received: true }) // Retornar 200 para não reenviar
      }

      // IMPORTANTE: Buscar payment na API do Mercado Pago primeiro para obter external_reference
      let mpPaymentData = null
      let externalReference: string | undefined = undefined
      
      try {
        const mpPayment = await paymentClient.get({ id: paymentId })
        mpPaymentData = mpPayment
        externalReference = mpPayment.external_reference
        paymentStatus = mpPayment.status || paymentStatus
        console.log('✅ Payment encontrado na API do MP:', {
          id: mpPayment.id,
          status: mpPayment.status,
          external_reference: mpPayment.external_reference,
        })
      } catch (error: any) {
        console.warn('⚠️ Não foi possível buscar payment na API do MP:', error.message)
        // Continuar tentando buscar no banco
      }

      // Buscar payment no banco usando external_reference (timelineId)
      // O external_reference é o timelineId que passamos na preference
      let payment = null
      
      if (externalReference) {
        // Buscar pelo timeline_id (external_reference)
        const { data: paymentByRef, error: refError } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('timeline_id', externalReference)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        if (!refError && paymentByRef) {
          payment = paymentByRef
          console.log('✅ Payment encontrado por external_reference:', payment.id)
        }
      }
      
      // Se não encontrou, tentar pelo payment_id (pode ser que o payment_id seja o preference_id)
      if (!payment) {
        const { data: paymentById, error: idError } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('mercado_pago_payment_id', paymentId)
          .maybeSingle()
        
        if (!idError && paymentById) {
          payment = paymentById
          console.log('✅ Payment encontrado por mercado_pago_payment_id:', payment.id)
        }
      }
      
      // Se ainda não encontrou, tentar buscar pelo preference_id (que pode estar salvo como mercado_pago_payment_id inicialmente)
      if (!payment && mpPaymentData?.metadata?.preference_id) {
        const { data: paymentByPref, error: prefError } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('mercado_pago_payment_id', mpPaymentData.metadata.preference_id)
          .maybeSingle()
        
        if (!prefError && paymentByPref) {
          payment = paymentByPref
          console.log('✅ Payment encontrado por preference_id:', payment.id)
        }
      }

      if (!payment) {
        console.error('❌ Payment não encontrado no banco:', {
          paymentId,
          externalReference,
        })
        // Retornar 200 mesmo assim para não causar reenvios
        return NextResponse.json({ received: true, message: 'Payment not found' })
      }

      // Usar dados já buscados da API do MP (se disponível)
      const realPaymentStatus = mpPaymentData?.status || paymentStatus

      // Processar status do pagamento (usar status real da API)
      // IMPORTANTE: Para Pix, o pagamento pode vir como "pending" inicialmente
      // e depois mudar para "approved" quando confirmado
      // NÃO enviar email em 'payment.created' - apenas quando realmente aprovado
      const isApproved = realPaymentStatus === 'approved' || paymentStatus === 'approved'
      
      if (isApproved) {
        console.log('✅ Pagamento aprovado, atualizando status...')
        console.log('Status verificado:', { realPaymentStatus, paymentStatus, action })
        
        // Atualizar status do pagamento
        // IMPORTANTE: paymentId do webhook é o ID real do payment (não da preference)
        const { error: updatePaymentError } = await supabaseAdmin
          .from('payments')
          .update({ 
            status: 'succeeded',
            mercado_pago_payment_id: paymentId, // Atualizar com o ID real do payment
          })
          .eq('id', payment.id)

        if (updatePaymentError) {
          console.error('Erro ao atualizar payment:', updatePaymentError)
        } else {
          console.log('✅ Payment atualizado com sucesso')
        }

        // Atualizar plano da timeline e publicar
        const { error: updateTimelineError } = await supabaseAdmin
          .from('timelines')
          .update({
            plan_type: payment.plan_type,
            is_published: true,
          })
          .eq('id', payment.timeline_id)

        if (updateTimelineError) {
          console.error('Erro ao atualizar timeline:', updateTimelineError)
        } else {
          console.log('✅ Timeline publicada com sucesso')
        }

        // Buscar timeline para log e envio de email
        const { data: timeline } = await supabaseAdmin
          .from('timelines')
          .select('slug, edit_token, title, subtitle')
          .eq('id', payment.timeline_id)
          .single()

        if (timeline) {
          console.log('✅ Pagamento processado com sucesso:', {
            timelineId: payment.timeline_id,
            slug: timeline.slug,
            editToken: timeline.edit_token?.substring(0, 8) + '...',
            paymentEmail: payment.email || 'NÃO ENCONTRADO',
          })
          
          // Buscar payment novamente para garantir que temos o email atualizado
          const { data: updatedPayment } = await supabaseAdmin
            .from('payments')
            .select('email')
            .eq('id', payment.id)
            .single()
          
          const emailToSend = updatedPayment?.email || payment.email
          
          // Enviar email de confirmação com os links
          if (emailToSend) {
            try {
              console.log('📧 Tentando enviar email para:', emailToSend)
              // Garantir que a URL está correta e sem barras duplas
              let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momentusi.com.br'
              siteUrl = siteUrl.replace(/\/$/, '') // Remover barra final se houver
              
              // Garantir que os links estão corretos
              const publicUrl = `${siteUrl}/${timeline.slug}`
              const editUrl = `${siteUrl}/edit?token=${timeline.edit_token}`
              
              console.log('📧 URLs geradas para email:', { publicUrl, editUrl, siteUrl })
              
              const { sendPaymentConfirmationEmail } = await import('@/lib/email')
              const emailResult = await sendPaymentConfirmationEmail({
                to: emailToSend,
                timelineTitle: timeline.title,
                timelineSubtitle: timeline.subtitle || undefined,
                publicUrl,
                editUrl,
                planType: payment.plan_type as 'essential' | 'complete',
              })
              
              if (emailResult.success) {
                console.log('✅ Email de confirmação enviado com sucesso:', emailResult.messageId)
              } else {
                console.warn('⚠️ Erro ao enviar email de confirmação:', emailResult.error)
              }
            } catch (emailError: any) {
              console.error('❌ Erro ao enviar email de confirmação:', emailError)
              console.error('Stack:', emailError?.stack)
              // Não falhar o webhook por causa do email
            }
          } else {
            console.warn('⚠️ Email não encontrado no payment:', {
              paymentId: payment.id,
              updatedPaymentEmail: updatedPayment?.email,
              originalPaymentEmail: payment.email,
            })
          }
        }
        
      } else if (realPaymentStatus === 'pending' || paymentStatus === 'pending') {
        // Pagamento pendente (ex: Pix aguardando confirmação)
        console.log('⏳ Pagamento pendente (aguardando confirmação)...')
        
        // Atualizar apenas o mercado_pago_payment_id se ainda não estiver atualizado
        if (payment.mercado_pago_payment_id !== paymentId) {
          await supabaseAdmin
            .from('payments')
            .update({ mercado_pago_payment_id: paymentId })
            .eq('id', payment.id)
          console.log('✅ Payment ID atualizado (pendente)')
        }
        
        // Não publicar ainda - aguardar confirmação
        console.log('⏳ Aguardando confirmação do pagamento...')
        
      } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled' || paymentStatus === 'refunded' || realPaymentStatus === 'rejected' || realPaymentStatus === 'cancelled' || realPaymentStatus === 'refunded') {
        console.log('❌ Pagamento rejeitado/cancelado, atualizando status...')
        
        // Atualizar status do pagamento para failed
        await supabaseAdmin
          .from('payments')
          .update({ status: 'failed' })
          .eq('id', payment.id)
          
        console.log('✅ Payment marcado como failed')
      } else {
        console.log('⚠️ Status de pagamento desconhecido:', {
          webhookStatus: paymentStatus,
          realStatus: realPaymentStatus,
          action,
        })
      }
    } else {
      // Log mais detalhado para debug
      console.log('⚠️ Tipo de webhook não processado:', {
        type: type || 'undefined',
        action: action || 'undefined',
        hasData: !!data,
        hasPaymentId: !!paymentId,
        bodyKeys: Object.keys(body),
      })
      
      // Se não conseguiu processar mas parece ser um webhook válido, retornar sucesso
      // para evitar reenvios infinitos
      return NextResponse.json({ received: true, message: 'Webhook format not recognized' })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erro no webhook do Mercado Pago:', error)
    console.error('Stack:', error?.stack)
    // Retornar 200 mesmo com erro para não causar reenvios infinitos
    return NextResponse.json(
      { received: true, error: error?.message },
      { status: 200 }
    )
  }
}

