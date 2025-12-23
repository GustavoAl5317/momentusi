'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AguardandoPagamentoPageContent() {
  const searchParams = useSearchParams()
  const timelineId = searchParams.get('timelineId')
  const [isSyncing, setIsSyncing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleVerificarPagamento = async () => {
    if (!timelineId || isSyncing) return
    
    setIsSyncing(true)
    setMessage(null)
    
    try {
      // Sincronizar pagamento
      const syncResponse = await fetch(`/api/timelines/${timelineId}/sync-payment`, {
        method: 'POST',
      })
      const syncData = await syncResponse.json()
      
      if (!syncResponse.ok) {
        setMessage(syncData.error || 'Erro ao verificar pagamento. Tente novamente.')
        return
      }
      
      // Verificar se o pagamento está aprovado (mesmo que não tenha sido atualizado agora)
      const paymentStatus = syncData.payment?.status || syncData.payment?.mercado_pago_status
      const isApproved = paymentStatus === 'succeeded' || paymentStatus === 'approved' || syncData.updated
      
      if (syncData.success && isApproved) {
        // Pagamento confirmado! Redirecionar para página de sucesso
        window.location.href = `/success?timelineId=${timelineId}`
      } else {
        // Verificar status atual do pagamento no banco
        const linksResponse = await fetch(`/api/timelines/${timelineId}/get-links`)
        const linksData = await linksResponse.json()
        
        if (linksData.payment?.status === 'succeeded') {
          // Pagamento já está aprovado, redirecionar
          window.location.href = `/success?timelineId=${timelineId}`
        } else {
          setMessage('Pagamento ainda não foi confirmado. Aguarde alguns segundos e tente novamente.')
        }
      }
    } catch (err: any) {
      console.error('Erro ao verificar pagamento:', err)
      setMessage('Erro ao verificar pagamento. Tente novamente.')
    } finally {
      setIsSyncing(false)
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Aguardando Confirmação do Pagamento
        </h1>
        
        <p className="text-gray-300 mb-6">
          Se você já realizou o pagamento Pix, clique no botão abaixo para verificar se foi confirmado.
        </p>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('confirmado') 
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleVerificarPagamento}
            disabled={isSyncing || !timelineId}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? 'Verificando...' : '✅ Já Paguei - Verificar Pagamento'}
          </button>

          {timelineId && (
            <Link
              href={`/buscar-links?timelineId=${timelineId}`}
              className="block w-full bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors text-center"
            >
              Buscar Links Manualmente
            </Link>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-6">
          💡 Dica: O pagamento Pix geralmente é confirmado em alguns segundos. 
          Se já passou mais de 1 minuto, verifique se o pagamento foi concluído no seu app bancário.
        </p>
      </div>
    </div>
  )
}

export default function AguardandoPagamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    }>
      <AguardandoPagamentoPageContent />
    </Suspense>
  )
}

