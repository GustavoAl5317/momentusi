import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar timeline por ID (com token de edição)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const editToken = searchParams.get('editToken')

    if (!editToken) {
      return NextResponse.json(
        { error: 'Token de edição necessário' },
        { status: 403 }
      )
    }

    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('timelines')
      .select('*')
      .eq('id', params.id)
      .eq('edit_token', editToken)
      .single()

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline não encontrada ou token inválido' },
        { status: 404 }
      )
    }

    const { data: moments, error: momentsError } = await supabaseAdmin
      .from('moments')
      .select('*')
      .eq('timeline_id', params.id)
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

    return NextResponse.json({
      ...timeline,
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

