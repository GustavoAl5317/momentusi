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
    console.log('Tipo:', body.type)
    console.log('Action:', body.action)
    console.log('Data:', JSON.stringify(body.data, null, 2))
    
    const { type, action, data } = body

    // Processar notificação de pagamento
    if (type === 'payment') {
      const paymentId = data?.id
      const paymentStatus = data?.status || action
      const externalReference = data?.external_reference // timelineId que passamos na preference
      
      console.log('Processando pagamento:', {
        paymentId,
        status: paymentStatus,
        externalReference,
      })

      if (!paymentId) {
        console.error('❌ Payment ID não encontrado no webhook')
        return NextResponse.json({ received: true }) // Retornar 200 para não reenviar
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
          console.log('Payment encontrado por external_reference:', payment.id)
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
          console.log('Payment encontrado por mercado_pago_payment_id:', payment.id)
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

      // IMPORTANTE: Buscar status real do pagamento na API do Mercado Pago
      // Isso é necessário porque o webhook pode vir com status "pending" mesmo que o pagamento tenha sido aprovado
      let realPaymentStatus = paymentStatus
      let mpPaymentData = null
      try {
        const mpPayment = await paymentClient.get({ id: paymentId })
        realPaymentStatus = mpPayment.status
        mpPaymentData = mpPayment
        console.log('Status real do pagamento na API do MP:', realPaymentStatus)
        console.log('External reference do pagamento:', mpPayment.external_reference)
      } catch (error: any) {
        console.warn('⚠️ Não foi possível buscar status do pagamento na API do MP:', error.message)
        // Continuar com o status do webhook se não conseguir buscar
      }

      // Processar status do pagamento (usar status real da API)
      // IMPORTANTE: Para Pix, o pagamento pode vir como "pending" inicialmente
      // e depois mudar para "approved" quando confirmado
      if (realPaymentStatus === 'approved' || paymentStatus === 'approved' || action === 'payment.created') {
        console.log('✅ Pagamento aprovado, atualizando status...')
        
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
              const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momentusi.vercel.app'
              const publicUrl = `${siteUrl}/${timeline.slug}`
              const editUrl = `${siteUrl}/edit?token=${timeline.edit_token}`
              
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
      console.log('⚠️ Tipo de webhook não processado:', type)
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

