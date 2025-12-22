import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se tem pagamento aprovado
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('timeline_id', params.id)
      .eq('status', 'succeeded')
      .single()

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado ou não aprovado' },
        { status: 403 }
      )
    }

    // Publicar timeline
    const { data: timeline, error } = await supabaseAdmin
      .from('timelines')
      .update({ is_published: true })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao publicar timeline' },
        { status: 500 }
      )
    }

    return NextResponse.json({ slug: timeline.slug })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

