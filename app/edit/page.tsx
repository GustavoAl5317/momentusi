'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TimelineEditor from '@/components/TimelineEditor'

function EditPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const timelineIdFromUrl = searchParams.get('timelineId')
  const [timelineId, setTimelineId] = useState<string | null>(timelineIdFromUrl)

  useEffect(() => {
    if (token && !timelineId) {
      // Buscar timeline pelo token
      fetch(`/api/timelines/by-token?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setTimelineId(data.id)
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar timeline:', err)
        })
    }
  }, [token, timelineId])

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Token de edição não encontrado
          </h1>
          <p className="text-gray-600">
            Você precisa do link de edição para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  if (!timelineId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TimelineEditor editToken={token} timelineId={timelineId} />
    </div>
  )
}

export default function EditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <EditPageContent />
    </Suspense>
  )
}

