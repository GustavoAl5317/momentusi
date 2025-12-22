import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: timeline, error } = await supabaseAdmin
      .from('timelines')
      .select('slug, edit_token')
      .eq('id', params.id)
      .single()

    if (error || !timeline) {
      return NextResponse.json(
        { error: 'Timeline não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(timeline)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

