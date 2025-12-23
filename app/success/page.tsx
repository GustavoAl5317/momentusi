'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const timelineId = searchParams.get('timelineId')
  const [links, setLinks] = useState<{ public: string | null; edit: string | null } | null>(null)
  const [timeline, setTimeline] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const maxRetries = 10 // Tentar por até ~50 segundos (10 tentativas x 5s)
  
  // Função para sincronizar pagamento manualmente
  const handleSyncPayment = async () => {
    if (!timelineId || isSyncing) return
    
    setIsSyncing(true)
    try {
      const syncResponse = await fetch(`/api/timelines/${timelineId}/sync-payment`, {
        method: 'POST',
      })
      const syncData = await syncResponse.json()
      
      if (syncData.success && syncData.updated) {
        // Recarregar links
        const response = await fetch(`/api/timelines/${timelineId}/get-links`)
        const data = await response.json()
        
        if (data.links?.public || data.links?.edit) {
          setLinks(data.links)
          setTimeline(data.timeline)
          setPayment(data.payment)
          setError(null)
          setIsLoading(false)
        } else {
          setError('Pagamento sincronizado, mas os links ainda não estão disponíveis. Aguarde alguns instantes.')
        }
      } else {
        setError('Pagamento ainda pendente. Verifique se o pagamento foi concluído no Mercado Pago.')
      }
    } catch (err: any) {
      console.error('Erro ao sincronizar:', err)
      setError('Erro ao sincronizar pagamento. Tente novamente.')
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    if (!timelineId) {
      setIsLoading(false)
      setError('ID da timeline não encontrado na URL')
      return
    }

    // Função para buscar links
    const fetchLinks = async () => {
      try {
        const response = await fetch(`/api/timelines/${timelineId}/get-links`)
        const data = await response.json()
        
        console.log('Dados recebidos:', data)
        
        if (data.error) {
          setError(data.error)
          setIsLoading(false)
          return
        }

        // Se tem links, sucesso!
        if (data.links?.public || data.links?.edit) {
          setLinks(data.links)
          setTimeline(data.timeline)
          setPayment(data.payment)
          setIsLoading(false)
          return
        }

        // Se não tem links ainda, verificar se precisa aguardar
        if (data.payment?.status === 'succeeded' && !data.timeline?.is_published) {
          // Pagamento aprovado mas timeline não publicada - aguardar webhook
          if (retryCount < maxRetries) {
            console.log(`Aguardando publicação... (tentativa ${retryCount + 1}/${maxRetries})`)
            setRetryCount(prev => prev + 1)
            setTimeout(() => {
              fetchLinks()
            }, 5000) // Tentar novamente em 5 segundos
          } else {
            setError('A publicação está demorando mais que o esperado. Tente novamente em alguns minutos ou use a página de busca de links.')
            setIsLoading(false)
          }
        } else if (data.payment?.status === 'pending') {
          // Pagamento pendente (ex: Pix) - sincronizar com Mercado Pago
          if (retryCount < maxRetries) {
            console.log(`Aguardando confirmação do pagamento... (tentativa ${retryCount + 1}/${maxRetries})`)
            
            // Tentar sincronizar o status do pagamento com o Mercado Pago
            try {
              const syncResponse = await fetch(`/api/timelines/${timelineId}/sync-payment`, {
                method: 'POST',
              })
              const syncData = await syncResponse.json()
              
              if (syncData.success && syncData.updated) {
                console.log('✅ Status sincronizado! Pagamento aprovado.')
                // Recarregar links imediatamente
                setTimeout(() => {
                  fetchLinks()
                }, 1000)
                return
              }
            } catch (syncError) {
              console.warn('Erro ao sincronizar pagamento:', syncError)
            }
            
            setRetryCount(prev => prev + 1)
            setTimeout(() => {
              fetchLinks()
            }, 5000)
          } else {
            setError('Pagamento ainda pendente. Verifique se o pagamento foi concluído e tente sincronizar manualmente.')
            setIsLoading(false)
          }
        } else {
          // Outro status
          setError('Status do pagamento não permite publicação ainda.')
          setIsLoading(false)
        }
      } catch (err: any) {
        console.error('Erro ao buscar links:', err)
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          setTimeout(() => {
            fetchLinks()
          }, 5000)
        } else {
          setError('Erro ao buscar links. Tente novamente mais tarde.')
          setIsLoading(false)
        }
      }
    }
    
    // Aguardar 2 segundos para o webhook processar
    setTimeout(() => {
      fetchLinks()
    }, 2000)
  }, [timelineId, retryCount, maxRetries])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processando pagamento...
          </h2>
          <p className="text-gray-600 mb-4">
            Aguardando confirmação do pagamento e publicação da timeline.
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Tentativa {retryCount}/{maxRetries}...
            </p>
          )}
          <div className="mt-6">
            <Link
              href={`/buscar-links?timelineId=${timelineId}`}
              className="text-pink-600 hover:text-pink-700 text-sm underline"
            >
              Ou busque seus links manualmente →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error || !links) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Links não disponíveis ainda'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error 
              ? 'Não foi possível obter os links automaticamente.'
              : 'Seu pagamento pode estar sendo processado. Tente buscar seus links manualmente.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {timelineId && (
              <>
                <button
                  onClick={handleSyncPayment}
                  disabled={isSyncing}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? 'Sincronizando...' : '🔄 Sincronizar Pagamento'}
                </button>
                <Link
                  href={`/buscar-links?timelineId=${timelineId}`}
                  className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-center"
                >
                  Buscar Links Manualmente
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const timelineUrl = links.public
  const editUrl = links.edit

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Aprovado!
          </h1>
          <p className="text-gray-600">
            Sua linha do tempo foi publicada com sucesso.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {timelineUrl && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-2">
                🌐 Link da Página Pública:
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={timelineUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(timelineUrl)
                    alert('✅ Link copiado!')
                  }}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              <Link
                href={timelineUrl}
                target="_blank"
                className="text-pink-600 hover:text-pink-700 text-sm mt-2 inline-block"
              >
                👁️ Ver página pública →
              </Link>
            </div>
          )}

          {editUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 mb-2">
                ✏️ Link de Edição (Guarde este link!):
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editUrl)
                    alert('✅ Link copiado!')
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ⚠️ Este link permite editar sua linha do tempo. Guarde-o com segurança!
              </p>
            </div>
          )}

          {!timelineUrl && !editUrl && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⏳ Os links ainda não estão disponíveis. Aguarde alguns instantes e tente novamente.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {timelineUrl && (
            <Link
              href={timelineUrl}
              className="flex-1 bg-pink-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Ver Minha Linha do Tempo
            </Link>
          )}
          <Link
            href="/"
            className="flex-1 bg-gray-200 text-gray-800 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Criar Outra
          </Link>
        </div>
        
        {timelineId && (
          <div className="mt-4 text-center">
            <Link
              href={`/buscar-links?timelineId=${timelineId}`}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Não recebeu os links? Busque manualmente aqui
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}

