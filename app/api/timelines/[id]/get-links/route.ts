import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Obter links da timeline (público e edição) pelo timelineId
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timelineId = params.id
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const cleanSiteUrl = siteUrl.replace(/\/$/, '')

    // Buscar timeline
    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('timelines')
      .select('id, slug, edit_token, is_published, plan_type')
      .eq('id', timelineId)
      .single()

    if (timelineError || !timeline) {
      return NextResponse.json(
        { error: 'Timeline não encontrada' },
        { status: 404 }
      )
    }

    // Buscar payment para verificar status
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('status, plan_type')
      .eq('timeline_id', timelineId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Gerar links
    const publicUrl = timeline.slug 
      ? `${cleanSiteUrl}/${timeline.slug}`
      : null
    
    const editUrl = timeline.edit_token
      ? `${cleanSiteUrl}/edit?token=${timeline.edit_token}`
      : null

    return NextResponse.json({
      timeline: {
        id: timeline.id,
        slug: timeline.slug,
        is_published: timeline.is_published,
        plan_type: timeline.plan_type,
      },
      payment: payment ? {
        status: payment.status,
        plan_type: payment.plan_type,
      } : null,
      links: {
        public: publicUrl,
        edit: editUrl,
      },
    })
  } catch (error) {
    console.error('Erro ao obter links:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

