'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function BuscarLinksPageContent() {
  const searchParams = useSearchParams()
  const initialTimelineId = searchParams.get('timelineId') || ''
  
  const [timelineId, setTimelineId] = useState(initialTimelineId)
  const [links, setLinks] = useState<{ public: string | null; edit: string | null } | null>(null)
  const [timeline, setTimeline] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!timelineId.trim()) {
      setError('Por favor, insira o ID da timeline')
      return
    }

    setIsLoading(true)
    setError(null)
    setLinks(null)

    try {
      const response = await fetch(`/api/timelines/${timelineId}/get-links`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsLoading(false)
        return
      }

      setLinks(data.links)
      setTimeline(data.timeline)
      setPayment(data.payment)
    } catch (err: any) {
      console.error('Erro ao buscar links:', err)
      setError('Erro ao buscar links. Verifique o ID e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Buscar Links da Timeline
          </h1>
          <p className="text-gray-600">
            Digite o ID da sua timeline para obter os links públicos e de edição
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID da Timeline:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={timelineId}
              onChange={(e) => setTimelineId(e.target.value)}
              placeholder="Cole o ID da timeline aqui"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 O ID da timeline é o código único que você recebeu após criar sua timeline
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Buscando links...</p>
          </div>
        )}

        {links && timeline && (
          <div className="space-y-4">
            {payment && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Status do Pagamento:</h3>
                  {payment.status === 'pending' && (
                    <button
                      onClick={async () => {
                        setIsLoading(true)
                        try {
                          const response = await fetch(`/api/timelines/${timelineId}/sync-payment`, {
                            method: 'POST',
                          })
                          const data = await response.json()
                          if (data.success) {
                            // Recarregar os links
                            handleSearch()
                          } else {
                            alert('Erro ao sincronizar: ' + (data.error || 'Erro desconhecido'))
                          }
                        } catch (err) {
                          alert('Erro ao sincronizar pagamento')
                        } finally {
                          setIsLoading(false)
                        }
                      }}
                      disabled={isLoading}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      🔄 Sincronizar com Mercado Pago
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-medium ${payment.status === 'succeeded' ? 'text-green-600' : payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {payment.status === 'succeeded' ? '✅ Aprovado' : payment.status === 'pending' ? '⏳ Pendente' : '❌ Falhou'}
                  </span> | 
                  Plano: <span className="font-medium">{payment.plan_type === 'essential' ? 'Essencial' : 'Completo'}</span>
                </p>
                {payment.status === 'pending' && (
                  <p className="text-xs text-yellow-700 mt-2">
                    💡 Em sandbox, pagamentos podem ficar como "pending". Clique em "Sincronizar" para verificar o status real no Mercado Pago.
                  </p>
                )}
              </div>
            )}

            {links.public && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-2">
                  🌐 Link da Página Pública:
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={links.public}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(links.public!)
                      alert('✅ Link copiado!')
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 whitespace-nowrap"
                  >
                    Copiar
                  </button>
                </div>
                <Link
                  href={links.public}
                  target="_blank"
                  className="text-pink-600 hover:text-pink-700 text-sm mt-2 inline-block"
                >
                  👁️ Ver página pública →
                </Link>
              </div>
            )}

            {links.edit && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-2">
                  ✏️ Link de Edição (Guarde este link!):
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={links.edit}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(links.edit!)
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

            {!links.public && !links.edit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⏳ Os links ainda não estão disponíveis. Isso pode acontecer se:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                  <li>O pagamento ainda está sendo processado</li>
                  <li>O webhook ainda não foi processado</li>
                  <li>A timeline ainda não foi publicada</li>
                </ul>
                <p className="text-sm text-yellow-800 mt-2">
                  Tente novamente em alguns minutos.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-pink-600 hover:text-pink-700 text-sm underline"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BuscarLinksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <BuscarLinksPageContent />
    </Suspense>
  )
}

