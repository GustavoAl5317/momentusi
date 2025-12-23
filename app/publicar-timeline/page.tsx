'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PublicarTimelinePageContent() {
  const searchParams = useSearchParams()
  const timelineId = searchParams.get('timelineId')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSincronizarEPublicar = async () => {
    if (!timelineId || isProcessing) return
    
    setIsProcessing(true)
    setMessage(null)
    setSuccess(false)
    
    try {
      // Primeiro, sincronizar o pagamento
      const syncResponse = await fetch(`/api/timelines/${timelineId}/sync-payment`, {
        method: 'POST',
      })
      const syncData = await syncResponse.json()
      
      if (syncData.error) {
        setMessage(`Erro ao sincronizar: ${syncData.error}`)
        setIsProcessing(false)
        return
      }

      if (syncData.success && syncData.updated) {
        setMessage('✅ Pagamento confirmado e timeline publicada com sucesso!')
        setSuccess(true)
        
        // Buscar links
        setTimeout(async () => {
          const linksResponse = await fetch(`/api/timelines/${timelineId}/get-links`)
          const linksData = await linksResponse.json()
          
          if (linksData.links?.public) {
            window.location.href = linksData.links.public
          }
        }, 2000)
      } else {
        // Tentar publicar diretamente se tiver pagamento aprovado
        const publishResponse = await fetch(`/api/timelines/${timelineId}/publish`, {
          method: 'POST',
        })
        const publishData = await publishResponse.json()
        
        if (publishResponse.ok) {
          setMessage('✅ Timeline publicada com sucesso!')
          setSuccess(true)
          
          setTimeout(() => {
            window.location.href = `/${publishData.slug}`
          }, 2000)
        } else {
          setMessage(`⚠️ ${publishData.error || 'Pagamento ainda não foi confirmado. Verifique se o pagamento foi concluído no Mercado Pago.'}`)
        }
      }
    } catch (err: any) {
      console.error('Erro ao publicar timeline:', err)
      setMessage('Erro ao processar. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Publicar Timeline
        </h1>
        
        <p className="text-gray-300 mb-6">
          Clique no botão abaixo para sincronizar o pagamento e publicar sua timeline.
        </p>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            success || message.includes('✅')
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleSincronizarEPublicar}
            disabled={isProcessing || !timelineId}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processando...' : '🔄 Sincronizar e Publicar'}
          </button>

          {timelineId && (
            <Link
              href={`/buscar-links?timelineId=${timelineId}`}
              className="block w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors text-center"
            >
              Buscar Links
            </Link>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-6">
          💡 Esta ação verifica o status do pagamento no Mercado Pago e publica a timeline se o pagamento foi confirmado.
        </p>
      </div>
    </div>
  )
}

export default function PublicarTimelinePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    }>
      <PublicarTimelinePageContent />
    </Suspense>
  )
}

