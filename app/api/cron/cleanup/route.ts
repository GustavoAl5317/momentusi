import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * API Route para limpeza automática de pagamentos pendentes
 * Pode ser agendada no Vercel Cron Jobs
 * 
 * Executa a função cleanup_pending_payments() no Supabase
 * Remove timelines não publicadas há mais de 23 horas sem pagamento aprovado
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se tem autorização (cron secret do Vercel)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🧹 Iniciando limpeza de pagamentos pendentes...')

    // Executar função de limpeza no Supabase
    const { data, error } = await supabaseAdmin.rpc('cleanup_pending_payments')

    if (error) {
      console.error('❌ Erro ao executar limpeza:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao executar limpeza',
          details: error.message 
        },
        { status: 500 }
      )
    }

    const result = data?.[0] || { deleted_timelines: 0, deleted_payments: 0, deleted_moments: 0 }

    console.log('✅ Limpeza concluída:', {
      timelines: result.deleted_timelines,
      payments: result.deleted_payments,
      moments: result.deleted_moments,
    })

    return NextResponse.json({
      success: true,
      deleted: {
        timelines: result.deleted_timelines || 0,
        payments: result.deleted_payments || 0,
        moments: result.deleted_moments || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Erro na limpeza:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

