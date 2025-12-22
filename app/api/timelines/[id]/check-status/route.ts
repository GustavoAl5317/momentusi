import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Verificar status do pagamento e publicação
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timelineId = params.id

    // Buscar timeline
    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('timelines')
      .select('id, slug, is_published, plan_type, edit_token')
      .eq('id', timelineId)
      .single()

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline não encontrada' },
        { status: 404 }
      )
    }

    // Buscar payment
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('id, status, plan_type, created_at')
      .eq('timeline_id', timelineId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return NextResponse.json({
      timeline: {
        id: timeline.id,
        slug: timeline.slug,
        is_published: timeline.is_published,
        plan_type: timeline.plan_type,
        has_edit_token: !!timeline.edit_token,
      },
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        plan_type: payment.plan_type,
        created_at: payment.created_at,
      } : null,
    })
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

