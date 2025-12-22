'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import TimelineEditor from '@/components/TimelineEditor'

export default function CreatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'complete'>(
    (searchParams.get('plan') as 'essential' | 'complete') || 'essential'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TimelineEditor initialPlan={selectedPlan} />
    </div>
  )
}

