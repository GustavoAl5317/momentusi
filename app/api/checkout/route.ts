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
    
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const normalizedEmail = email.trim().toLowerCase()
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Email inválido. Por favor, insira um email válido.' },
        { status: 400 }
      )
    }

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
    
    // Detectar se estamos no Vercel
    const isVercel = !!process.env.VERCEL
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    const vercelEnv = process.env.VERCEL_ENV // 'production', 'preview', 'development'
    const isProduction = vercelEnv === 'production' || (process.env.NODE_ENV === 'production' && !vercelEnv)
    
    // Obter URL do site - tentar várias fontes em ordem de prioridade
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    
    // Se não estiver definida e estivermos no Vercel, usar a URL do Vercel
    if (!siteUrl && isVercel && vercelUrl) {
      siteUrl = vercelUrl
      console.log('Usando URL do Vercel:', siteUrl)
    }
    
    // Se ainda não estiver definida, tentar obter do request
    if (!siteUrl) {
      const origin = request.headers.get('origin') || request.headers.get('host')
      if (origin) {
        // Se origin já tem protocolo, usar diretamente
        if (origin.startsWith('http://') || origin.startsWith('https://')) {
          siteUrl = origin
        } else {
          // Adicionar protocolo baseado no ambiente
          const protocol = isProduction ? 'https://' : 'http://'
          siteUrl = `${protocol}${origin}`
        }
      }
    }
    
    // Fallback baseado no ambiente
    if (!siteUrl) {
      if (isProduction) {
        // Em produção, usar URL padrão do Vercel ou do domínio configurado
        siteUrl = vercelUrl || 'https://momentusi.vercel.app'
      } else {
        // Em desenvolvimento, usar localhost
        siteUrl = 'http://localhost:3000'
      }
    }
    
    // Garantir que a URL não tenha barra no final e seja válida
    let cleanSiteUrl = siteUrl.replace(/\/$/, '').trim()
    
    // Se estiver em produção e a URL for localhost, substituir pela URL do Vercel
    const isLocalhost = cleanSiteUrl.includes('localhost') || cleanSiteUrl.includes('127.0.0.1')
    if (isProduction && isLocalhost) {
      if (vercelUrl) {
        cleanSiteUrl = vercelUrl
        console.log('⚠️ URL localhost detectada em produção. Substituindo por:', cleanSiteUrl)
      } else {
        // Se não tiver URL do Vercel, usar a URL padrão
        cleanSiteUrl = 'https://momentusi.vercel.app'
        console.log('⚠️ URL localhost detectada em produção. Usando URL padrão:', cleanSiteUrl)
      }
    }
    
    // Validar URL
    if (!cleanSiteUrl || (!cleanSiteUrl.startsWith('http://') && !cleanSiteUrl.startsWith('https://'))) {
      return NextResponse.json(
        { 
          error: 'NEXT_PUBLIC_SITE_URL deve ser uma URL válida (ex: http://localhost:3000 ou https://seusite.com)',
          hint: `URL atual: ${cleanSiteUrl || '(vazia)'}. Configure NEXT_PUBLIC_SITE_URL no Vercel ou no arquivo .env.local`
        },
        { status: 400 }
      )
    }
    
    // Validação final: não permitir localhost em produção do Mercado Pago
    const finalIsLocalhost = cleanSiteUrl.includes('localhost') || cleanSiteUrl.includes('127.0.0.1')
    if (isMercadoPagoProduction && finalIsLocalhost) {
      return NextResponse.json(
        { 
          error: 'NEXT_PUBLIC_SITE_URL não pode ser localhost em produção do Mercado Pago. Use uma URL pública (ex: https://seusite.com)',
          hint: `URL atual: ${cleanSiteUrl}. Configure NEXT_PUBLIC_SITE_URL=https://momentusi.vercel.app no Vercel`
        },
        { status: 400 }
      )
    }
    
    // notification_url: em produção sempre enviar, em sandbox opcional
    const notificationUrl = isLocalhost 
      ? undefined // Não enviar em localhost (sandbox ou dev)
      : `${cleanSiteUrl}/api/webhooks/mercadopago` // Enviar se for URL pública
    
    // Construir URLs de retorno (garantir que sejam strings válidas)
    // IMPORTANTE: pendingUrl também redireciona para /success porque pagamentos Pix
    // podem ficar pendentes e o usuário deve aguardar na página de sucesso
    const successUrl = `${cleanSiteUrl}/success?timelineId=${timelineId}`
    const failureUrl = `${cleanSiteUrl}/create?timelineId=${timelineId}`
    const pendingUrl = `${cleanSiteUrl}/success?timelineId=${timelineId}&status=pending`
    
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
    // 
    // IMPORTANTE: NÃO enviar payer.email na preference
    // Enviar payer.email empurra o checkout para o fluxo "express/login/challenge"
    // que pode travar e deixar o botão "Criar Pix" desabilitado.
    // Deixamos o checkout rodar como "guest" para que o Mercado Pago peça
    // os dados necessários (CPF, etc.) dentro do próprio checkout.
    
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
      // NÃO incluir payer.email - deixa o checkout rodar como "guest"
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      payment_methods: {
        // IMPORTANTE: Não incluir excluded_payment_methods e excluded_payment_types vazios
        // Arrays vazios com objetos vazios podem causar o botão ficar desabilitado
        installments: 12, // Permitir até 12x
        default_installments: 1, // Padrão: pagamento à vista
        // Se precisar excluir métodos específicos, adicione aqui:
        // excluded_payment_methods: [{ id: "method_id" }],
        // excluded_payment_types: [{ id: "type_id" }],
      },
      binary_mode: false, // Permitir pagamentos pendentes (necessário para Pix)
      auto_return: 'all', // Redirecionar automaticamente em todos os casos (approved, pending, etc)
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
      payer: 'NÃO ENVIADO (checkout como guest)',
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
    
    // Log detalhado da resposta para diagnóstico
    const preferenceData = preference as any
    
    console.log('=== PREFERENCE CRIADA - DIAGNÓSTICO COMPLETO ===')
    console.log('ID:', preference.id)
    console.log('init_point:', preference.init_point ? '✅ SIM' : '❌ NÃO')
    console.log('sandbox_init_point:', preference.sandbox_init_point ? '✅ SIM' : '❌ NÃO')
    console.log('Payer:', 'NÃO ENVIADO (checkout como guest - Mercado Pago pedirá dados)')
    console.log('Items count:', preferenceData.items?.length || 0)
    console.log('Payment methods:', JSON.stringify(preferenceData.payment_methods || {}, null, 2))
    console.log('Back URLs:', {
      success: preferenceData.back_urls?.success ? '✅ OK' : '❌ FALTANDO',
      failure: preferenceData.back_urls?.failure ? '✅ OK' : '❌ FALTANDO',
      pending: preferenceData.back_urls?.pending ? '✅ OK' : '❌ FALTANDO',
    })
    console.log('Binary mode:', preferenceData.binary_mode)
    console.log('Auto return:', preferenceData.auto_return)
    console.log('Notification URL:', notificationUrl ? '✅ Configurada' : '⚠️ Não configurada (localhost)')
    console.log('Site URL usado:', cleanSiteUrl)
    
    // Verificar se há erros na resposta
    if (preferenceData.error) {
      console.error('❌ ERRO na preference do Mercado Pago:', preferenceData.error)
      throw new Error(`Erro ao criar preference: ${preferenceData.error.message || JSON.stringify(preferenceData.error)}`)
    }
    
    // Validações críticas que podem causar botão desabilitado
    if (!preference.id) {
      throw new Error('Preference não foi criada corretamente pelo Mercado Pago')
    }
    
    if (!preferenceData.back_urls || !preferenceData.back_urls.success) {
      console.error('❌ ERRO CRÍTICO: Back URLs não estão configuradas')
      throw new Error('Back URLs não configuradas corretamente na preference do Mercado Pago')
    }
    
    // Verificar se o item tem preço válido
    if (!preferenceData.items || preferenceData.items.length === 0) {
      console.error('❌ ERRO CRÍTICO: Nenhum item na preference')
      throw new Error('Nenhum item configurado na preference do Mercado Pago')
    }
    
    const firstItem = preferenceData.items[0]
    if (!firstItem.unit_price || firstItem.unit_price <= 0) {
      console.error('❌ ERRO CRÍTICO: Preço do item inválido:', firstItem.unit_price)
      throw new Error('Preço do item inválido na preference do Mercado Pago')
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
    console.log('Back URLs configuradas:', {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl,
    })
    console.log('Auto return:', preferenceBody.auto_return)

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

