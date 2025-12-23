'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MomentForm from './MomentForm'
import MomentList from './MomentList'
import ThemeOption from './ThemeOption'
import TimelinePreviewEditor from './TimelinePreviewEditor'
import { PlanType, Moment } from '@/types'

interface TimelineEditorProps {
  initialPlan?: PlanType
  editToken?: string
  timelineId?: string
}

export default function TimelineEditor({
  initialPlan = 'essential',
  editToken,
  timelineId,
}: TimelineEditorProps) {
  const router = useRouter()
  const [plan, setPlan] = useState<PlanType>(initialPlan)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [theme, setTheme] = useState('default')
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical')
  const [moments, setMoments] = useState<Moment[]>([])
  const [finalMessage, setFinalMessage] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(!!timelineId)
  const [showPreview, setShowPreview] = useState(false)
  
  // Cores customizadas (apenas para plano completo)
  const [customColors, setCustomColors] = useState({
    primary: '#9333ea', // roxo padrão
    secondary: '#ec4899', // rosa padrão
    background: '#0f172a', // slate-950
    text: '#f1f5f9', // slate-100
    card: '#1e293b', // slate-800
  })

  const maxMoments = plan === 'essential' ? 10 : Infinity
  const canAddMore = moments.length < maxMoments

  useEffect(() => {
    if (timelineId && editToken) {
      loadTimeline()
    }
  }, [timelineId, editToken])

  const loadTimeline = async () => {
    try {
      const response = await fetch(
        `/api/timelines/${timelineId}?editToken=${editToken}`
      )
      if (response.ok) {
        const data = await response.json()
        setTitle(data.title)
        setSubtitle(data.subtitle || '')
        setTheme(data.theme)
        setLayout(data.layout || 'vertical')
        setPlan(data.plan_type)
        setMoments(data.moments || [])
        setFinalMessage(data.final_message || '')
        setIsPrivate(data.is_private || false)
      }
    } catch (error) {
      console.error('Erro ao carregar timeline:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor, adicione um título para sua linha do tempo.')
      return
    }

    if (moments.length === 0) {
      alert('Adicione pelo menos um momento à sua linha do tempo.')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        title,
        subtitle,
        theme,
        layout,
        plan_type: plan,
        moments,
        final_message: finalMessage,
        is_private: isPrivate,
        password: password || undefined,
        timeline_id: timelineId,
        edit_token: editToken,
        // Incluir cores customizadas apenas se for plano completo e não tiver tema selecionado
        custom_colors: (plan === 'complete' && theme === 'custom') ? customColors : undefined,
      }

      const response = await fetch('/api/timelines', {
        method: timelineId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.editToken) {
          // Nova timeline criada - salvar timelineId no estado
          if (data.timelineId) {
            // Atualizar timelineId para poder fazer checkout
            window.location.href = `/edit?token=${data.editToken}&timelineId=${data.timelineId}`
          } else {
            router.push(`/edit?token=${data.editToken}`)
          }
        } else if (data.timelineId) {
          // Timeline atualizada - manter timelineId
          alert('Linha do tempo salva com sucesso!')
        } else {
          // Timeline atualizada
          alert('Linha do tempo salva com sucesso!')
        }
      } else {
        const errorMsg = data.error || data.details || 'Erro ao salvar linha do tempo.'
        console.error('Erro na resposta:', data)
        alert(errorMsg)
      }
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      alert(`Erro ao salvar linha do tempo: ${error?.message || 'Erro desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || moments.length === 0) {
      alert('Complete sua linha do tempo antes de publicar.')
      return
    }

    // Se não tem timelineId, salvar primeiro
    if (!timelineId) {
      setIsSaving(true)
      try {
        const payload = {
          title,
          subtitle,
          theme,
          layout,
          plan_type: plan,
          moments,
          final_message: finalMessage,
          is_private: isPrivate,
          password: password || undefined,
          // Incluir cores customizadas apenas se for plano completo e tema customizado
          custom_colors: (plan === 'complete' && theme === 'custom') ? customColors : undefined,
        }

        const response = await fetch('/api/timelines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (response.ok && data.timelineId) {
          // Redirecionar para checkout com o timelineId
          router.push(`/checkout?timelineId=${data.timelineId}&plan=${plan}`)
        } else {
          alert(data.error || 'Erro ao salvar linha do tempo.')
        }
      } catch (error) {
        console.error('Erro ao salvar:', error)
        alert('Erro ao salvar linha do tempo.')
      } finally {
        setIsSaving(false)
      }
      return
    }

    // Verificar se já tem pagamento
    const response = await fetch(`/api/timelines/${timelineId}/check-payment`)
    const data = await response.json()

    if (data.hasPayment) {
      // Já tem pagamento, salvar atualizações e publicar
      await handleSave()
      const publishResponse = await fetch(
        `/api/timelines/${timelineId}/publish`,
        { method: 'POST' }
      )
      if (publishResponse.ok) {
        const publishData = await publishResponse.json()
        router.push(`/${publishData.slug}`)
      }
    } else {
      // Redirecionar para checkout
      router.push(`/checkout?timelineId=${timelineId}&plan=${plan}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header com botão voltar e tabs */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-pink-500/30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto py-3">
            {/* Botão Voltar */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline font-medium">Voltar</span>
            </button>

            {/* Tabs para alternar entre Editor e Preview */}
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-3 sm:px-6 py-2 sm:py-4 text-sm sm:text-base font-semibold transition-all border-b-2 ${
                  !showPreview
                    ? 'text-pink-400 border-pink-500'
                    : 'text-gray-400 border-transparent hover:text-pink-400'
                }`}
              >
                <span className="hidden sm:inline">✏️ </span>Editor
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-3 sm:px-6 py-2 sm:py-4 text-sm sm:text-base font-semibold transition-all border-b-2 ${
                  showPreview
                    ? 'text-pink-400 border-pink-500'
                    : 'text-gray-400 border-transparent hover:text-pink-400'
                }`}
              >
                <span className="hidden sm:inline">👀 </span>Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPreview ? (
        // Preview em tempo real
        <div className="max-w-7xl mx-auto">
          <TimelinePreviewEditor
            title={title || 'Sua Linha do Tempo'}
            subtitle={subtitle}
            theme={theme}
            layout={layout}
            moments={moments}
            plan={plan}
            finalMessage={finalMessage}
          />
        </div>
      ) : (
        // Editor
        <div className="max-w-5xl mx-auto py-4 sm:py-8 px-4">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 border border-pink-500/30">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl">✨</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Criar Linha do Tempo
          </h1>
          <p className="text-sm sm:text-base text-gray-300">Transforme seus momentos em uma história única</p>
        </div>

        {/* Seleção de Plano */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Escolha seu Plano
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setPlan('essential')}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                plan === 'essential'
                  ? 'border-pink-600 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-[1.02] sm:scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-base sm:text-lg mb-1">Essencial</div>
              <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-2">R$ 19,90</div>
              <div className="text-xs sm:text-sm text-gray-300">Até 10 momentos</div>
            </button>
            <button
              onClick={() => setPlan('complete')}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                plan === 'complete'
                  ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-[1.02] sm:scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold text-base sm:text-lg mb-1">Completo</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">R$ 39,90</div>
              <div className="text-xs sm:text-sm text-gray-300">Momentos ilimitados</div>
            </button>
          </div>
        </div>

        {/* Título e Subtítulo */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm sm:text-base font-semibold text-white mb-2">
            Título Principal <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Nossa História de Amor"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-base sm:text-lg"
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-sm sm:text-base font-semibold text-white mb-2">
            Subtítulo <span className="text-gray-400 text-xs sm:text-sm">(opcional)</span>
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: Ana e João"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-base sm:text-lg"
          />
        </div>

        {/* Layout */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
            Layout da Timeline
          </label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setLayout('vertical')}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                layout === 'vertical'
                  ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-[1.02] sm:scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl sm:text-4xl mb-2">📊</div>
              <div className="font-bold text-sm sm:text-lg mb-1">Vertical</div>
              <div className="text-xs sm:text-sm text-gray-300">Linha do tempo tradicional</div>
            </button>
            <button
              type="button"
              onClick={() => setLayout('horizontal')}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                layout === 'horizontal'
                  ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-[1.02] sm:scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl sm:text-4xl mb-2">➡️</div>
              <div className="font-bold text-sm sm:text-lg mb-1">Horizontal</div>
              <div className="text-xs sm:text-sm text-gray-300">Linha do tempo horizontal</div>
            </button>
          </div>
        </div>

        {/* Tema */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
            Tema Visual
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <ThemeOption
              value="default"
              name="Padrão"
              icon="✨"
              colors={['from-blue-500', 'to-indigo-500']}
              selected={theme === 'default'}
              onClick={() => setTheme('default')}
            />
            {plan === 'complete' && (
              <>
                <ThemeOption
                  value="romantic"
                  name="Romântico"
                  icon="💕"
                  colors={['from-rose-500', 'to-pink-500']}
                  selected={theme === 'romantic'}
                  onClick={() => setTheme('romantic')}
                />
                <ThemeOption
                  value="elegant"
                  name="Elegante"
                  icon="👔"
                  colors={['from-neutral-600', 'to-neutral-700']}
                  selected={theme === 'elegant'}
                  onClick={() => setTheme('elegant')}
                />
                <ThemeOption
                  value="vintage"
                  name="Vintage"
                  icon="📷"
                  colors={['from-amber-500', 'to-orange-500']}
                  selected={theme === 'vintage'}
                  onClick={() => setTheme('vintage')}
                />
                <ThemeOption
                  value="modern"
                  name="Moderno"
                  icon="🚀"
                  colors={['from-cyan-500', 'to-sky-500']}
                  selected={theme === 'modern'}
                  onClick={() => setTheme('modern')}
                />
                <ThemeOption
                  value="custom"
                  name="Personalizado"
                  icon="🎨"
                  colors={['from-purple-500', 'to-pink-500']}
                  selected={theme === 'custom'}
                  onClick={() => setTheme('custom')}
                />
              </>
            )}
          </div>
          
          {/* Seletor de cores customizadas (apenas para plano completo e tema customizado) */}
          {plan === 'complete' && theme === 'custom' && (
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-pink-500/30">
              <label className="block text-sm font-semibold text-white mb-4">
                🎨 Personalize suas Cores
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Cor Principal</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                      className="flex-1 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-gray-600"
                      placeholder="#9333ea"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Cor Secundária</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                      className="flex-1 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-gray-600"
                      placeholder="#ec4899"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.background}
                      onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColors.background}
                      onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                      className="flex-1 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-gray-600"
                      placeholder="#0f172a"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.text}
                      onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColors.text}
                      onChange={(e) => setCustomColors({ ...customColors, text: e.target.value })}
                      className="flex-1 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-gray-600"
                      placeholder="#f1f5f9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Cards</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors.card}
                      onChange={(e) => setCustomColors({ ...customColors, card: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColors.card}
                      onChange={(e) => setCustomColors({ ...customColors, card: e.target.value })}
                      className="flex-1 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-gray-600"
                      placeholder="#1e293b"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Momentos */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Momentos
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-1">
                {moments.length} {plan === 'essential' ? '/ 10' : ''} adicionados
              </p>
            </div>
            {canAddMore && <div className="w-full sm:w-auto"><MomentForm onAdd={setMoments} /></div>}
          </div>
          <MomentList
            moments={moments}
            onUpdate={setMoments}
            onDelete={setMoments}
            plan={plan}
          />
          {!canAddMore && (
            <p className="text-sm text-gray-400 mt-2">
              Limite de momentos atingido. Upgrade para o plano Completo para
              adicionar mais momentos.
            </p>
          )}
        </div>

        {/* Recursos Premium */}
        {plan === 'complete' && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Carta Final (opcional)
              </label>
              <textarea
                value={finalMessage}
                onChange={(e) => setFinalMessage(e.target.value)}
                placeholder="Uma mensagem especial para encerrar sua linha do tempo..."
                rows={4}
                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-white">
                  Página Privada
                </span>
              </label>
              {isPrivate && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha para acesso (opcional)"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              )}
            </div>
          </>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:flex-1 bg-slate-700 text-gray-200 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-slate-600 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {isSaving ? 'Salvando...' : '💾 Salvar Rascunho'}
          </button>
          <button
            onClick={handlePublish}
            className="w-full sm:flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105"
          >
            🚀 Publicar Página
          </button>
        </div>
          </div>
        </div>
      )}
    </div>
  )
}

