import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura não encontrada' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Erro ao verificar webhook:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Processar evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Atualizar status do pagamento
    await supabaseAdmin
      .from('payments')
      .update({ status: 'succeeded', stripe_payment_intent_id: session.payment_intent as string })
      .eq('stripe_payment_intent_id', session.id)

    // Atualizar plano da timeline
    const timelineId = session.metadata?.timeline_id
    const plan = session.metadata?.plan as 'essential' | 'complete'

    if (timelineId) {
      await supabaseAdmin
        .from('timelines')
        .update({
          plan_type: plan,
          is_published: true,
        })
        .eq('id', timelineId)

      // Buscar timeline para enviar email
      const { data: timeline } = await supabaseAdmin
        .from('timelines')
        .select('*')
        .eq('id', timelineId)
        .single()

      if (timeline) {
        // TODO: Enviar email com link da página e token de edição
        // Por enquanto, apenas log
        console.log('Pagamento aprovado:', {
          timelineId,
          slug: timeline.slug,
          editToken: timeline.edit_token,
          email: session.customer_email,
        })
      }
    }
  } else if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session

    await supabaseAdmin
      .from('payments')
      .update({ status: 'failed' })
      .eq('stripe_payment_intent_id', session.id)
  }

  return NextResponse.json({ received: true })
}

