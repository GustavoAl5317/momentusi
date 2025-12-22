'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TimelineEditor from '@/components/TimelineEditor'

function CreatePageContent() {
  const searchParams = useSearchParams()
  const selectedPlan = (searchParams.get('plan') as 'essential' | 'complete') || 'essential'

  return (
    <div className="min-h-screen bg-gray-50">
      <TimelineEditor initialPlan={selectedPlan} />
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  )
}

