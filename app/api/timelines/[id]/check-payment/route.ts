import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('timeline_id', params.id)
      .eq('status', 'succeeded')
      .single()

    if (error || !payment) {
      return NextResponse.json({ hasPayment: false })
    }

    return NextResponse.json({ hasPayment: true, payment })
  } catch (error) {
    return NextResponse.json({ hasPayment: false })
  }
}

