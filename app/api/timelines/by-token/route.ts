import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      )
    }

    const { data: timeline, error } = await supabaseAdmin
      .from('timelines')
      .select('id')
      .eq('edit_token', token)
      .single()

    if (error || !timeline) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 404 }
      )
    }

    return NextResponse.json({ id: timeline.id })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

