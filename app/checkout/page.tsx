'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const timelineId = searchParams.get('timelineId')
  const plan = searchParams.get('plan') as 'essential' | 'complete'
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  // Validar se o email é válido para habilitar o botão
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = email.trim().length > 0 && emailRegex.test(email.trim())
  const canSubmit = isEmailValid && !isProcessing && timelineId && plan

  useEffect(() => {
    if (!timelineId || !plan) {
      router.push('/')
    }
  }, [timelineId, plan, router])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsProcessing(true)

    try {
      // Criar checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timelineId,
          plan,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar checkout')
      }

      // Redirecionar para Mercado Pago Checkout
      // Priorizar checkoutUrl (já selecionada pelo servidor), depois sandboxInitPoint, depois initPoint
      const checkoutUrl = data.checkoutUrl || data.sandboxInitPoint || data.initPoint
      
      console.log('Redirecionando para checkout:', checkoutUrl)
      
      if (checkoutUrl) {
        console.log('Redirecionando para:', checkoutUrl)
        window.location.href = checkoutUrl
      } else {
        throw new Error('URL de checkout não retornada pelo servidor')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento')
      setIsProcessing(false)
    }
  }

  if (!timelineId || !plan) {
    return null
  }

  const planName = plan === 'essential' ? 'Essencial' : 'Completo'
  const planPrice = plan === 'essential' ? 'R$ 19,90' : 'R$ 39,90'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Finalizar Compra
        </h1>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-900">{planName}</div>
              <div className="text-sm text-gray-600">Pagamento único</div>
            </div>
            <div className="text-2xl font-bold text-pink-600">
              {planPrice}
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email para receber o link de edição
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processando...' : 'Pagar com Mercado Pago'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Seu pagamento é processado de forma segura pelo Mercado Pago.
        </p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  )
}

