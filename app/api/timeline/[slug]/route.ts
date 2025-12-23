import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

// GET - Buscar timeline pública por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')

    // Buscar timeline
    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('timelines')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single()

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se é privada e se precisa de senha
    if (timeline.is_private) {
      if (!password) {
        return NextResponse.json(
          { error: 'Senha necessária', requiresPassword: true },
          { status: 403 }
        )
      }

      const passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')

      if (passwordHash !== timeline.password_hash) {
        return NextResponse.json(
          { error: 'Senha incorreta', requiresPassword: true },
          { status: 403 }
        )
      }
    }

    // Buscar momentos
    const { data: moments, error: momentsError } = await supabaseAdmin
      .from('moments')
      .select('*')
      .eq('timeline_id', timeline.id)
      .order('order_index', { ascending: true })

    if (momentsError) {
      return NextResponse.json(
        { error: 'Erro ao buscar momentos' },
        { status: 500 }
      )
    }

    // Parse image_urls se for string JSON
    const parsedMoments = (moments || []).map((moment: any) => {
      if (moment.image_urls) {
        // Se for string, parsear; se já for array, usar direto
        if (typeof moment.image_urls === 'string') {
          try {
            moment.image_urls = JSON.parse(moment.image_urls)
          } catch (e) {
            // Se falhar, tentar como array com um único item
            moment.image_urls = [moment.image_urls]
          }
        }
      }
      return moment
    })

    // Remover dados sensíveis
    const { password_hash, edit_token, ...publicTimeline } = timeline

    return NextResponse.json({
      ...publicTimeline,
      moments: parsedMoments,
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

