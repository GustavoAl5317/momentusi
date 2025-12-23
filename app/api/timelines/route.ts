import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

// Gerar token secreto de edição
function generateEditToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST - Criar nova timeline
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Dados recebidos:', { 
      title: body.title, 
      momentsCount: body.moments?.length,
      plan: body.plan_type,
      theme: body.theme,
      layout: body.layout
    })
    
    const {
      title,
      subtitle,
      theme,
      layout,
      plan_type,
      moments,
      final_message,
      is_private,
      password,
      custom_colors,
    } = body

    if (!title || !moments || moments.length === 0) {
      return NextResponse.json(
        { error: 'Título e pelo menos um momento são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar limite de momentos
    if (plan_type === 'essential' && moments.length > 10) {
      return NextResponse.json(
        { error: 'Plano Essencial permite no máximo 10 momentos' },
        { status: 400 }
      )
    }

    const editToken = generateEditToken()
    let passwordHash = null

    if (is_private && password) {
      passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')
    }

    // Criar timeline primeiro (sem slug ainda, será gerado após criar com o ID)
    const timelineData: any = {
      title,
      subtitle: subtitle || null,
      theme: theme || 'default',
      layout: layout || 'vertical',
      plan_type: plan_type || 'essential',
      is_published: false,
      is_private: is_private || false,
      password_hash: passwordHash,
      edit_token: editToken,
      final_message: final_message || null,
    }
    
    // Adicionar cores customizadas se fornecidas (apenas para plano completo)
    if (custom_colors && plan_type === 'complete') {
      timelineData.custom_colors = typeof custom_colors === 'string' 
        ? custom_colors 
        : JSON.stringify(custom_colors)
    }
    
    console.log('Tentando criar timeline com dados:', {
      title,
      theme,
      layout,
      plan_type,
      hasEditToken: !!editToken,
    })

    // Verificar conexão primeiro
    console.log('Verificando conexão com Supabase...')
    const { data: testData, error: testError } = await supabaseAdmin
      .from('timelines')
      .select('id')
      .limit(1)
    
    console.log('Resultado do teste de conexão:', { 
      hasData: !!testData, 
      error: testError ? {
        code: (testError as any)?.code,
        message: (testError as any)?.message?.substring(0, 200), // Limitar tamanho
        details: (testError as any)?.details
      } : null
    })
    
    // Verificar se o erro é HTML (indicando URL incorreta)
    if (testError) {
      const errorMessage = String((testError as any)?.message || '')
      if (errorMessage.includes('<!DOCTYPE html>') || errorMessage.includes('<html')) {
        console.error('❌ ERRO CRÍTICO: A URL do Supabase está retornando HTML em vez de JSON!')
        console.error('Isso significa que NEXT_PUBLIC_SUPABASE_URL está incorreta.')
        console.error('A URL deve ser: https://[seu-project-id].supabase.co')
        console.error('NÃO deve ser: https://app.supabase.com')
        return NextResponse.json(
          { 
            error: 'Configuração incorreta do Supabase',
            details: 'A URL do Supabase está incorreta. Verifique NEXT_PUBLIC_SUPABASE_URL no arquivo .env.local',
            hint: 'A URL deve ser: https://[seu-project-id].supabase.co (encontre em Supabase Dashboard > Settings > API > Project URL)'
          },
          { status: 500 }
        )
      }
    }
    
    if (testError && testError.code !== 'PGRST116' && testError.code !== '42P01') {
      console.error('Erro ao conectar com tabela timelines:', testError)
      return NextResponse.json(
        { 
          error: 'Erro de conexão com o banco de dados',
          details: (testError as any)?.message?.substring(0, 500) || (testError as any)?.code || 'Erro desconhecido',
          hint: 'Verifique as variáveis de ambiente e as políticas RLS no Supabase'
        },
        { status: 500 }
      )
    }

    let timeline, timelineError
    try {
      const result = await supabaseAdmin
        .from('timelines')
        .insert(timelineData)
        .select()
        .single()
      
      timeline = result.data
      timelineError = result.error
      
      if (timelineError) {
        console.error('Erro completo do Supabase:', JSON.stringify(timelineError, null, 2))
        console.error('Tipo do erro:', typeof timelineError)
        console.error('Keys do erro:', Object.keys(timelineError || {}))
        console.error('Código do erro:', (timelineError as any)?.code)
        console.error('Mensagem do erro:', (timelineError as any)?.message)
        console.error('Detalhes do erro:', (timelineError as any)?.details)
        console.error('Hint do erro:', (timelineError as any)?.hint)
      }
    } catch (insertException: any) {
      console.error('Exceção ao inserir:', insertException)
      timelineError = insertException
    }

    if (timelineError) {
      
      return NextResponse.json(
        { 
          error: 'Erro ao criar linha do tempo',
          details: timelineError.message || timelineError.code || JSON.stringify(timelineError),
          hint: timelineError.hint || 'Verifique se as tabelas existem no banco de dados'
        },
        { status: 500 }
      )
    }

    if (!timeline) {
      console.error('Timeline não foi criada - resposta vazia')
      return NextResponse.json(
        { error: 'Erro ao criar linha do tempo: timeline não retornada' },
        { status: 500 }
      )
    }
    
    console.log('Timeline criada com sucesso:', timeline.id)
    
    // Gerar slug baseado no ID da timeline (garante unicidade)
    const slug = timeline.id
    
    // Atualizar timeline com o slug
    const { error: slugUpdateError } = await supabaseAdmin
      .from('timelines')
      .update({ slug })
      .eq('id', timeline.id)
    
    if (slugUpdateError) {
      console.error('Erro ao atualizar slug:', slugUpdateError)
      // Deletar timeline se não conseguir atualizar o slug
      await supabaseAdmin.from('timelines').delete().eq('id', timeline.id)
      return NextResponse.json(
        { error: 'Erro ao gerar slug da timeline' },
        { status: 500 }
      )
    }
    
    // Atualizar objeto timeline com o slug
    timeline.slug = slug

    // Criar momentos
    const momentsData = moments.map((moment: any, index: number) => ({
      timeline_id: timeline.id,
      date: moment.date,
      title: moment.title,
      description: moment.description,
      image_url: moment.image_url || null,
      music_url: moment.music_url || null,
      order_index: index,
    }))

    const { error: momentsError } = await supabaseAdmin
      .from('moments')
      .insert(momentsData)

    if (momentsError) {
      console.error('Erro ao criar momentos:', momentsError)
      // Deletar timeline se falhar
      await supabaseAdmin.from('timelines').delete().eq('id', timeline.id)
      return NextResponse.json(
        { 
          error: 'Erro ao criar momentos',
          details: momentsError.message || JSON.stringify(momentsError)
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: timeline.id,
      timelineId: timeline.id,
      slug: timeline.slug,
      editToken: timeline.edit_token,
    })
  } catch (error: any) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar timeline existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      timeline_id,
      edit_token,
      title,
      subtitle,
      theme,
      layout,
      plan_type,
      moments,
      final_message,
      is_private,
      password,
      custom_colors,
    } = body

    if (!timeline_id || !edit_token) {
      return NextResponse.json(
        { error: 'ID da timeline e token de edição são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar token de edição
    const { data: timeline, error: checkError } = await supabaseAdmin
      .from('timelines')
      .select('*')
      .eq('id', timeline_id)
      .eq('edit_token', edit_token)
      .single()

    if (checkError || !timeline) {
      return NextResponse.json(
        { error: 'Token de edição inválido' },
        { status: 403 }
      )
    }

    // Validar limite de momentos
    if (plan_type === 'essential' && moments.length > 10) {
      return NextResponse.json(
        { error: 'Plano Essencial permite no máximo 10 momentos' },
        { status: 400 }
      )
    }

    let passwordHash = timeline.password_hash

    if (is_private && password) {
      passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')
    } else if (!is_private) {
      passwordHash = null
    }

    // Preparar dados de atualização
    const updateData: any = {
      title,
      subtitle: subtitle || null,
      theme: theme || 'default',
      layout: layout || 'vertical',
      plan_type: plan_type || timeline.plan_type,
      is_private: is_private || false,
      password_hash: passwordHash,
      final_message: final_message || null,
    }
    
    // Adicionar cores customizadas se fornecidas (apenas para plano completo)
    if (custom_colors && plan_type === 'complete') {
      updateData.custom_colors = typeof custom_colors === 'string' 
        ? custom_colors 
        : JSON.stringify(custom_colors)
    } else if (theme !== 'custom') {
      // Se mudou de custom para outro tema, remover cores customizadas
      updateData.custom_colors = null
    }
    
    // Atualizar timeline
    const { error: updateError } = await supabaseAdmin
      .from('timelines')
      .update(updateData)
      .eq('id', timeline_id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar timeline' },
        { status: 500 }
      )
    }

    // Deletar momentos antigos e criar novos
    await supabaseAdmin.from('moments').delete().eq('timeline_id', timeline_id)

    const momentsData = moments.map((moment: any, index: number) => ({
      timeline_id,
      date: moment.date,
      title: moment.title,
      description: moment.description,
      image_url: moment.image_url || null,
      music_url: moment.music_url || null,
      order_index: index,
    }))

    const { error: momentsError } = await supabaseAdmin
      .from('moments')
      .insert(momentsData)

    if (momentsError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar momentos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

