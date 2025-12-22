import { NextRequest, NextResponse } from 'next/server'
import {
  mercadoPago,
  PLAN_PRICES,
  PlanType,
  getTokenPrefix,
  isMercadoPagoProduction,
} from '@/lib/mercadopago'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Logs de ambiente (sem vazar tokens)
    const nodeEnv = process.env.NODE_ENV || 'development'
    const tokenPrefix = getTokenPrefix()
    const ambiente = isMercadoPagoProduction ? 'PRODUÇÃO' : 'SANDBOX (TESTE)'
    
    console.log('=== CHECKOUT REQUEST ===')
    console.log('Ambiente Node:', nodeEnv)
    console.log('Token Mercado Pago:', tokenPrefix, `(${ambiente})`)
    
    const body = await request.json()
    const { timelineId, plan, email } = body
    
    // Log do payload (sem dados sensíveis)
    console.log('Payload recebido:', {
      timelineId: timelineId?.substring(0, 8) + '...',
      plan,
      emailDomain: email?.split('@')[1] || 'N/A',
    })

    if (!timelineId || !plan || !email) {
      return NextResponse.json(
        { error: 'timelineId, plan e email são obrigatórios' },
        { status: 400 }
      )
    }

    if (plan !== 'essential' && plan !== 'complete') {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Garantir que plan seja do tipo correto
    const planType: PlanType = plan as PlanType

    // Buscar timeline
    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('timelines')
      .select('*')
      .eq('id', timelineId)
      .single()

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline não encontrada' },
        { status: 404 }
      )
    }

    const amount = PLAN_PRICES[planType]
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Garantir que a URL não tenha barra no final e seja válida
    const cleanSiteUrl = siteUrl.replace(/\/$/, '')
    
    // Validar URL
    if (!cleanSiteUrl || !cleanSiteUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SITE_URL deve ser uma URL válida (ex: http://localhost:3000 ou https://seusite.com)' },
        { status: 400 }
      )
    }
    
    // Validações específicas por ambiente
    const isLocalhost = cleanSiteUrl.includes('localhost') || cleanSiteUrl.includes('127.0.0.1')
    
    if (isMercadoPagoProduction && isLocalhost) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SITE_URL não pode ser localhost em produção. Use uma URL pública (ex: https://seusite.com)' },
        { status: 400 }
      )
    }
    
    // notification_url: em produção sempre enviar, em sandbox opcional
    const notificationUrl = isLocalhost 
      ? undefined // Não enviar em localhost (sandbox ou dev)
      : `${cleanSiteUrl}/api/webhooks/mercadopago` // Enviar se for URL pública
    
    // Construir URLs de retorno (garantir que sejam strings válidas)
    const successUrl = `${cleanSiteUrl}/success?timelineId=${timelineId}`
    const failureUrl = `${cleanSiteUrl}/create?timelineId=${timelineId}`
    const pendingUrl = `${cleanSiteUrl}/create?timelineId=${timelineId}`
    
    // Validar que as URLs não estão vazias
    if (!successUrl || !failureUrl || !pendingUrl) {
      return NextResponse.json(
        { error: 'Erro ao construir URLs de retorno' },
        { status: 500 }
      )
    }
    
    console.log('URLs configuradas:', {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl,
      notification: notificationUrl || '(não configurado - localhost)',
    })

    // Criar Preference no Mercado Pago (Checkout Pro)
    // Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/checkout-customization/preferences
    
    const preferenceBody: any = {
      items: [
        {
          id: timelineId, // ID único do item
          title: `Momenta - Plano ${planType === 'essential' ? 'Essencial' : 'Completo'}`,
          description: `Linha do tempo: ${timeline.title}`.substring(0, 255), // Limitar tamanho
          quantity: 1,
          unit_price: Number(amount), // Garantir que seja número
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: email,
      },
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12, // Permitir até 12x
      },
      binary_mode: false, // Permitir pagamentos pendentes (necessário para Pix)
      external_reference: timelineId,
      metadata: {
        timeline_id: timelineId,
        plan: planType,
      },
      statement_descriptor: 'Momenta',
    }
    
    // Adicionar notification_url apenas se não for localhost
    if (notificationUrl) {
      preferenceBody.notification_url = notificationUrl
    }
    
    // Log do payload (sem dados sensíveis)
    console.log('Preference payload:', {
      items: preferenceBody.items.map((item: any) => ({
        id: item.id?.substring(0, 8) + '...',
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id,
      })),
      payer: { email: email?.split('@')[1] ? '***@' + email.split('@')[1] : 'N/A' },
      back_urls: {
        success: successUrl.includes('localhost') ? 'localhost' : 'produção',
        failure: failureUrl.includes('localhost') ? 'localhost' : 'produção',
        pending: pendingUrl.includes('localhost') ? 'localhost' : 'produção',
      },
      payment_methods: preferenceBody.payment_methods,
      has_notification_url: !!notificationUrl,
    })
    
    const preference = await mercadoPago.create({
      body: preferenceBody,
    })
    
    // Log da resposta (sem dados sensíveis)
    console.log('Preference criada:', {
      id: preference.id,
      has_init_point: !!preference.init_point,
      has_sandbox_init_point: !!preference.sandbox_init_point,
      payment_methods: (preference as any).payment_methods || 'N/A',
      items_count: (preference as any).items?.length || 0,
    })
    
    // Validar que a preference foi criada corretamente
    if (!preference.id) {
      throw new Error('Preference não foi criada corretamente pelo Mercado Pago')
    }

    // Salvar payment no banco
    // IMPORTANTE: preference.id é o ID da preference, não do payment
    // O payment.id virá no webhook quando o pagamento for processado
    const { error: paymentError } = await supabaseAdmin.from('payments').insert({
      timeline_id: timelineId,
      mercado_pago_payment_id: preference.id, // Por enquanto, salvar preference.id (será atualizado no webhook)
      plan_type: planType,
      amount: Math.round(amount * 100), // Converter para centavos
      status: 'pending',
    })
    
    if (paymentError) {
      console.error('Erro ao salvar payment:', paymentError)
    } else {
      console.log('✅ Payment salvo no banco com preference.id:', preference.id)
    }

    // Selecionar URL correta baseada no ambiente
    // PRODUÇÃO: usar init_point
    // SANDBOX: usar sandbox_init_point
    const checkoutUrl = isMercadoPagoProduction
      ? preference.init_point
      : (preference.sandbox_init_point || preference.init_point)
    
    if (!checkoutUrl) {
      const ambiente = isMercadoPagoProduction ? 'produção' : 'sandbox'
      console.error(`❌ ERRO: URL de checkout de ${ambiente} não retornada!`)
      throw new Error(`URL de checkout de ${ambiente} não disponível`)
    }
    
    console.log('=== CHECKOUT RESPONSE ===')
    console.log('Ambiente:', isMercadoPagoProduction ? 'PRODUÇÃO' : 'SANDBOX (TESTE)')
    console.log('URL selecionada:', checkoutUrl.includes('sandbox') ? 'SANDBOX' : 'PRODUÇÃO')
    console.log('URL completa:', checkoutUrl)

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      checkoutUrl: checkoutUrl, // URL correta baseada no ambiente
    })
  } catch (error: any) {
    console.error('Erro no checkout:', error)
    console.error('Detalhes do erro:', {
      message: error?.message,
      error: error?.error,
      status: error?.status,
      cause: error?.cause,
    })
    
    // Retornar mensagem de erro mais específica
    const errorMessage = error?.message || 'Erro ao processar checkout'
    const errorStatus = error?.status || 500
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error?.error || error?.cause || undefined,
      },
      { status: errorStatus }
    )
  }
}

