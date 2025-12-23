'use client'

import { useState, useEffect } from 'react'
import { TimelineWithMoments, Moment } from '@/types'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { QRCodeSVG } from 'qrcode.react'
import MomentModal from './MomentModal'
import TimelineVertical from './TimelineVertical'
import TimelineHorizontal from './TimelineHorizontal'
import ShareModal from './ShareModal'

// Componente de ícones flutuantes temáticos
function FloatingIcons({ theme }: { theme: string }) {
  const icons = {
    default: ['✨', '💫', '⭐', '🌟', '💖', '🎉', '💝', '🎊'],
    romantic: ['💕', '🌹', '💐', '💌', '💑', '💝', '🌺', '💗', '🌷', '🌸'],
    elegant: ['👔', '💎', '🎩', '✨', '🌟', '💼', '🎭', '🕯️', '🥂', '🎪'],
    vintage: ['📷', '📸', '🎞️', '📼', '💿', '📻', '🎵', '🎬', '📽️', '🎹'],
    modern: ['🚀', '💻', '📱', '⚡', '🎯', '🔥', '💡', '🌟', '🎮', '💾'],
  }
  
  const themeIcons = icons[theme as keyof typeof icons] || icons.default
  
  return (
    <>
      {themeIcons.map((icon, index) => (
        <div
          key={index}
          className="floating-icon"
          style={{
            left: `${5 + (index * 10)}%`,
            top: `${5 + (index % 4) * 25}%`,
            animationDelay: `${index * 0.6}s`,
            fontSize: `${20 + (index % 4) * 6}px`,
          }}
        >
          {icon}
        </div>
      ))}
    </>
  )
}

interface TimelineViewProps {
  timeline: TimelineWithMoments
}

// Retorna array vazio para exemplos - apenas indica que haverá imagens
const getExampleImages = (moment: Moment, theme: string): string[] => {
  // Para exemplos, retornamos array com 3 itens vazios para indicar que haverá 3 fotos
  // Mas não retornamos URLs reais, apenas placeholders
  return ['', '', ''] // 3 slots para imagens
}

export default function TimelineView({ timeline }: TimelineViewProps) {
  const [showQRCode, setShowQRCode] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // URL de exemplo para timelines de exemplo
  const isExample = timeline.slug.startsWith('exemplo-') || ['romantico', 'moderno', 'elegante', 'vintage', 'padrao'].includes(timeline.slug)
  const exampleSlug = timeline.slug.replace('exemplo-', '') || timeline.slug
  const exampleUrl = `https://momenta.app/${exampleSlug}`
  
  // Usar useEffect para garantir que window só seja acessado no cliente
  const [siteUrl, setSiteUrl] = useState('')
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin)
    }
  }, [])
  
  const timelineUrl = isExample ? exampleUrl : (siteUrl ? `${siteUrl}/${timeline.slug}` : `/${timeline.slug}`)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: timeline.title,
          text: timeline.subtitle || timeline.title,
          url: timelineUrl,
        })
      } catch (err) {
        // Usuário cancelou ou erro
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(timelineUrl)
      alert('Link copiado para a área de transferência!')
    }
  }

  const handleCopyUrl = () => {
    if (isExample) {
      // Toast de aviso para exemplos
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 right-4 bg-yellow-500 text-yellow-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn'
      toast.innerHTML = '<div class="font-bold">⚠️ EXEMPLO</div><div class="text-sm">Este link é apenas para demonstração</div>'
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.classList.add('animate-slideOut')
        setTimeout(() => document.body.removeChild(toast), 300)
      }, 3000)
      return
    }
    
    navigator.clipboard.writeText(timelineUrl)
    // Toast melhorado
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn'
    toast.textContent = '✅ Link copiado para a área de transferência!'
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.classList.add('animate-slideOut')
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 2000)
  }

  const handleMomentClick = (moment: Moment) => {
    setSelectedMoment(moment)
    setIsModalOpen(true)
  }

  const getMomentImages = (moment: Moment): string[] => {
    // Se for exemplo, retorna imagens de exemplo baseado no conteúdo
    if (isExample) {
      return getExampleImages(moment, timeline.theme)
    }
    // Priorizar image_urls (múltiplas imagens)
    if (moment.image_urls && moment.image_urls.length > 0) {
      return moment.image_urls
    }
    // Fallback para image_url (compatibilidade com dados antigos)
    if (moment.image_url) {
      return [moment.image_url]
    }
    return []
  }

  // Aplicar tema escuro com azul escuro e rosa
  const themeClasses = {
    default: {
      bg: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950',
      card: 'bg-indigo-900 shadow-xl border-2 border-indigo-600',
      text: 'text-indigo-50',
      accent: 'text-purple-300',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      dateBadge: 'bg-purple-600 text-white border-2 border-purple-400',
      marker: 'bg-purple-500',
      line: 'bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-500',
      headerBlob1: 'bg-purple-600/20',
      headerBlob2: 'bg-indigo-600/20',
    },
    romantic: {
      bg: 'bg-gradient-to-b from-rose-900 via-pink-900 to-rose-900',
      card: 'bg-rose-800 shadow-xl border-2 border-rose-500',
      text: 'text-rose-50',
      accent: 'text-pink-300',
      button: 'bg-pink-600 hover:bg-pink-700 text-white',
      dateBadge: 'bg-pink-600 text-white border-2 border-pink-400',
      marker: 'bg-pink-500',
      line: 'bg-gradient-to-b from-pink-500 via-rose-500 to-pink-500',
      headerBlob1: 'bg-pink-600/20',
      headerBlob2: 'bg-rose-600/20',
    },
    elegant: {
      bg: 'bg-gradient-to-b from-slate-800 via-gray-800 to-slate-800',
      card: 'bg-slate-700 shadow-xl border-2 border-slate-500',
      text: 'text-slate-100',
      accent: 'text-gray-300',
      button: 'bg-gray-700 hover:bg-gray-800 text-white',
      dateBadge: 'bg-gray-700 text-white border-2 border-gray-500',
      marker: 'bg-gray-600',
      line: 'bg-gradient-to-b from-gray-500 via-slate-500 to-gray-500',
      headerBlob1: 'bg-gray-600/20',
      headerBlob2: 'bg-slate-600/20',
    },
    vintage: {
      bg: 'bg-gradient-to-b from-amber-900 via-orange-900 to-amber-900',
      card: 'bg-amber-800 shadow-xl border-2 border-amber-500',
      text: 'text-amber-50',
      accent: 'text-orange-300',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      dateBadge: 'bg-orange-600 text-white border-2 border-orange-400',
      marker: 'bg-orange-500',
      line: 'bg-gradient-to-b from-orange-500 via-amber-500 to-orange-500',
      headerBlob1: 'bg-orange-600/20',
      headerBlob2: 'bg-amber-600/20',
    },
    modern: {
      bg: 'bg-gradient-to-b from-cyan-950 via-blue-950 to-cyan-950',
      card: 'bg-cyan-900 shadow-xl border-2 border-cyan-500',
      text: 'text-cyan-50',
      accent: 'text-sky-300',
      button: 'bg-sky-600 hover:bg-sky-700 text-white',
      dateBadge: 'bg-sky-600 text-white border-2 border-sky-400',
      marker: 'bg-sky-500',
      line: 'bg-gradient-to-b from-sky-500 via-cyan-500 to-sky-500',
      headerBlob1: 'bg-sky-600/20',
      headerBlob2: 'bg-cyan-600/20',
    },
  }

  // Processar cores customizadas se existirem
  let customColors: any = null
  if (timeline.theme === 'custom' && timeline.custom_colors) {
    try {
      customColors = typeof timeline.custom_colors === 'string' 
        ? JSON.parse(timeline.custom_colors) 
        : timeline.custom_colors
    } catch (e) {
      console.warn('Erro ao processar cores customizadas:', e)
    }
  }

  const theme = themeClasses[timeline.theme as keyof typeof themeClasses] || themeClasses.default

  // Aplicar variáveis CSS dinâmicas para o tema
  // Se tiver cores customizadas, usar elas; senão, usar cores do tema
  // Usar Record<string, string> para permitir CSS variables
  const themeVars: Record<string, string> = {
    '--line-color-1': customColors?.primary 
      ? `${customColors.primary}CC` // Adiciona transparência
      : (timeline.theme === 'romantic' ? 'rgba(236, 72, 153, 0.8)' :
         timeline.theme === 'elegant' ? 'rgba(100, 116, 139, 0.8)' :
         timeline.theme === 'vintage' ? 'rgba(251, 146, 60, 0.8)' :
         timeline.theme === 'modern' ? 'rgba(14, 165, 233, 0.8)' :
         'rgba(147, 51, 234, 0.8)'),
    '--line-color-2': customColors?.secondary 
      ? `${customColors.secondary}CC`
      : (timeline.theme === 'romantic' ? 'rgba(244, 63, 94, 0.8)' :
         timeline.theme === 'elegant' ? 'rgba(71, 85, 105, 0.8)' :
         timeline.theme === 'vintage' ? 'rgba(217, 119, 6, 0.8)' :
         timeline.theme === 'modern' ? 'rgba(6, 182, 212, 0.8)' :
         'rgba(99, 102, 241, 0.8)'),
    '--marker-color-1': customColors?.primary || 
      (timeline.theme === 'romantic' ? '#ec4899' :
       timeline.theme === 'elegant' ? '#64748b' :
       timeline.theme === 'vintage' ? '#fb923c' :
       timeline.theme === 'modern' ? '#0ea5e9' :
       '#9333ea'),
    '--marker-color-2': customColors?.secondary ||
      (timeline.theme === 'romantic' ? '#f43f5e' :
       timeline.theme === 'elegant' ? '#475569' :
       timeline.theme === 'vintage' ? '#d97706' :
       timeline.theme === 'modern' ? '#06b6d4' :
       '#6366f1'),
  }
  
  // Se tiver cores customizadas, aplicar no estilo inline
  const customStyle: React.CSSProperties = customColors ? {
    backgroundColor: customColors.background || undefined,
    color: customColors.text || undefined,
  } : {}

  return (
    <div 
      className={`min-h-screen ${customColors ? '' : theme.bg}`} 
      style={{ ...themeVars, ...customStyle } as React.CSSProperties}
    >
      {/* Header */}
      <div className="container mx-auto px-4 py-16 md:py-20 text-center relative">
        {/* Decoração de fundo com partículas e ondas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Blobs animados */}
          <div className={`absolute top-0 left-1/4 w-64 h-64 ${theme.headerBlob1} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob`}></div>
          <div className={`absolute top-0 right-1/4 w-64 h-64 ${theme.headerBlob2} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000`}></div>
          
          {/* Partículas flutuantes */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${10 + i * 12}%`,
                animationDelay: `${i * 2.5}s`,
              }}
            />
          ))}
          
          {/* Ondas de fundo */}
          <div className="wave-bg" style={{ top: '-50%', left: '-50%' }}></div>
          <div className="wave-bg" style={{ top: '-50%', left: '-50%', animationDelay: '10s' }}></div>
          
          {/* Ícones flutuantes temáticos */}
          <FloatingIcons theme={timeline.theme} />
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent animate-gradient animate-breathe relative inline-block">
            <span className="relative z-10">{timeline.title}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent blur-xl opacity-50 animate-pulse"></span>
          </h1>
          {timeline.subtitle && (
            <p className={`text-xl md:text-2xl ${theme.text} mb-12 font-light animate-fadeInUp animate-parallax`} style={{ animationDelay: '0.3s' }}>
              {timeline.subtitle}
            </p>
          )}

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => setShowShareModal(true)}
              className={`${theme.button} text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-110 shadow-lg hover:shadow-xl flex items-center gap-2 animate-breathe relative overflow-hidden group`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="group-hover:animate-bounce">📤</span>
                <span>Compartilhar</span>
              </span>
            </button>
            <button
              onClick={handleCopyUrl}
              className={`bg-slate-800 text-pink-400 border-2 border-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-pink-500/10 transition-all hover:scale-110 shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden group animate-breathe`}
              style={{ animationDelay: '0.2s' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="group-hover:rotate-12 transition-transform">🔗</span>
                <span>Copiar URL</span>
              </span>
              {isExample && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  TESTE
                </span>
              )}
            </button>
            {timeline.plan_type === 'complete' && (
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className={`${theme.button} text-white border-2 ${theme.button.replace('bg-', 'border-').replace(' hover:bg-', '')} px-8 py-3 rounded-full font-semibold transition-all hover:scale-110 shadow-lg hover:shadow-xl flex items-center gap-2`}
                style={{ animationDelay: '0.4s' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="group-hover:scale-125 transition-transform">📱</span>
                  <span>QR Code</span>
                </span>
                {isExample && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    TESTE
                  </span>
                )}
              </button>
            )}
          </div>

          {showQRCode && (
            <div className="flex flex-col items-center mb-12 animate-fadeIn">
              <div className={`${theme.card} p-6 rounded-2xl shadow-2xl relative`}>
                {isExample && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    ⚠️ APENAS EXEMPLO - QR Code não funcional
                  </div>
                )}
                <QRCodeSVG value={timelineUrl} size={200} />
              </div>
              {isExample && (
                <p className="mt-3 text-sm text-amber-900 bg-amber-200 border border-amber-400 px-4 py-2 rounded-lg">
                  ⚠️ Este é um exemplo. O QR Code e link são apenas para demonstração.
                </p>
              )}
            </div>
          )}

          {isExample && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-yellow-900 text-center">
                <span className="font-bold">⚠️ EXEMPLO:</span> Esta é uma timeline de demonstração. 
                O link e QR Code são apenas para visualização e não funcionarão.
              </p>
            </div>
          )}

          {/* Indicador visual de timeline */}
          <div className={`flex items-center justify-center gap-2 ${theme.text} opacity-70`}>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-pink-400"></div>
            <span className="text-sm font-medium">Linha do Tempo</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>
      </div>

      {/* Modal de Compartilhamento */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        timeline={{
          title: timeline.title,
          subtitle: timeline.subtitle || undefined,
          slug: timeline.slug,
        }}
        timelineUrl={timelineUrl}
        theme={timeline.theme}
      />

      {/* Timeline */}
      <div className="container mx-auto px-4 pb-12 relative">
        {/* Ícones flutuantes na área da timeline também */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingIcons theme={timeline.theme} />
        </div>
        
        <div className="relative z-10">
          {timeline.layout === 'horizontal' ? (
            <TimelineHorizontal
              moments={timeline.moments}
              theme={{ ...theme, customColors }}
              onMomentClick={handleMomentClick}
              getMomentImages={getMomentImages}
            />
          ) : (
            <TimelineVertical
              moments={timeline.moments}
              theme={{ ...theme, customColors }}
              onMomentClick={handleMomentClick}
              getMomentImages={getMomentImages}
            />
          )}
        </div>

        {/* Modal de Compartilhamento */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          timeline={{
            title: timeline.title,
            subtitle: timeline.subtitle || undefined,
            slug: timeline.slug,
          }}
          timelineUrl={timelineUrl}
          theme={timeline.theme}
        />

        {/* Carta Final */}
        {timeline.final_message && (
          <div className="max-w-3xl mx-auto mt-20 mb-12">
            <div className="relative">
              {/* Marcador final na timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full border-4 border-slate-800 shadow-xl hidden md:block"></div>
              
              <div className={`${theme.card} rounded-3xl shadow-2xl p-10 md:p-12 text-center`}>
                <div className="mb-6">
                  <span className="text-5xl">💌</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-6">
                  Carta Final
                </h3>
                <p className={`${theme.text} text-lg md:text-xl leading-relaxed whitespace-pre-line font-light`}>
                  {timeline.final_message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Momento */}
      {selectedMoment && (
        <MomentModal
          moment={selectedMoment}
          images={getMomentImages(selectedMoment)}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMoment(null)
          }}
          theme={theme}
        />
      )}

      {/* Marca simples apenas no plano básico */}
      {timeline.plan_type === 'essential' && (
        <footer className="container mx-auto px-4 py-4 text-center">
          <p className="text-xs text-gray-500/50">
            Criado com{' '}
            <a
              href="https://momentusi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400/60 hover:text-gray-300/80 transition-colors"
            >
              Momenta
            </a>
          </p>
        </footer>
      )}
    </div>
  )
}

