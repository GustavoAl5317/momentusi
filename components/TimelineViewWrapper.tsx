'use client'

import { useEffect, useState } from 'react'
import TimelineView from './TimelineView'
import { TimelineWithMoments } from '@/types'

interface TimelineViewWrapperProps {
  timeline: TimelineWithMoments
}

export default function TimelineViewWrapper({ timeline }: TimelineViewWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando timeline...</p>
        </div>
      </div>
    )
  }

  return <TimelineView timeline={timeline} />
}

