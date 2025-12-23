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

  // Aplicar tema com estilos mais distintos
  const themeClasses = {
    default: {
      bg: 'bg-gradient-to-br from-pink-50 via-white to-purple-50',
      card: 'bg-white shadow-lg border border-pink-100',
      text: 'text-gray-900',
      accent: 'text-pink-600',
      button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
      dateBadge: 'bg-gradient-to-r from-pink-500 to-purple-500',
      marker: 'bg-gradient-to-br from-pink-500 to-purple-500',
      line: 'from-pink-400 via-purple-400 to-pink-400',
      headerBlob1: 'bg-pink-200',
      headerBlob2: 'bg-purple-200',
    },
    romantic: {
      bg: 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-50',
      card: 'bg-white shadow-xl border-2 border-rose-200',
      text: 'text-gray-900',
      accent: 'text-rose-600',
      button: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
      dateBadge: 'bg-gradient-to-r from-rose-500 to-pink-500',
      marker: 'bg-gradient-to-br from-rose-500 to-pink-500',
      line: 'from-rose-400 via-pink-400 to-rose-400',
      headerBlob1: 'bg-rose-200',
      headerBlob2: 'bg-pink-200',
    },
    elegant: {
      bg: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100',
      card: 'bg-white shadow-2xl border-2 border-gray-300',
      text: 'text-gray-900',
      accent: 'text-slate-700',
      button: 'bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900',
      dateBadge: 'bg-gradient-to-r from-slate-600 to-gray-700',
      marker: 'bg-gradient-to-br from-slate-600 to-gray-700',
      line: 'from-slate-400 via-gray-400 to-slate-400',
      headerBlob1: 'bg-slate-200',
      headerBlob2: 'bg-gray-200',
    },
    vintage: {
      bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
      card: 'bg-amber-50 shadow-xl border-2 border-amber-300',
      text: 'text-amber-900',
      accent: 'text-amber-700',
      button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      dateBadge: 'bg-gradient-to-r from-amber-500 to-orange-500',
      marker: 'bg-gradient-to-br from-amber-500 to-orange-500',
      line: 'from-amber-400 via-orange-400 to-amber-400',
      headerBlob1: 'bg-amber-200',
      headerBlob2: 'bg-orange-200',
    },
    modern: {
      bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      card: 'bg-white shadow-xl border-2 border-indigo-200',
      text: 'text-gray-900',
      accent: 'text-indigo-600',
      button: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
      dateBadge: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      marker: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      line: 'from-indigo-400 via-purple-400 to-indigo-400',
      headerBlob1: 'bg-indigo-200',
      headerBlob2: 'bg-purple-200',
    },
  }

  const theme = themeClasses[timeline.theme as keyof typeof themeClasses] || themeClasses.default

  // Aplicar variáveis CSS dinâmicas para o tema
  const themeVars = {
    '--line-color-1': timeline.theme === 'romantic' ? 'rgba(244, 63, 94, 0.8)' :
                      timeline.theme === 'elegant' ? 'rgba(71, 85, 105, 0.8)' :
                      timeline.theme === 'vintage' ? 'rgba(245, 158, 11, 0.8)' :
                      timeline.theme === 'modern' ? 'rgba(99, 102, 241, 0.8)' :
                      'rgba(236, 72, 153, 0.8)',
    '--line-color-2': timeline.theme === 'romantic' ? 'rgba(236, 72, 153, 0.8)' :
                      timeline.theme === 'elegant' ? 'rgba(100, 116, 139, 0.8)' :
                      timeline.theme === 'vintage' ? 'rgba(251, 146, 60, 0.8)' :
                      timeline.theme === 'modern' ? 'rgba(139, 92, 246, 0.8)' :
                      'rgba(168, 85, 247, 0.8)',
    '--marker-color-1': timeline.theme === 'romantic' ? '#f43f5e' :
                        timeline.theme === 'elegant' ? '#475569' :
                        timeline.theme === 'vintage' ? '#f59e0b' :
                        timeline.theme === 'modern' ? '#6366f1' :
                        '#ec4899',
    '--marker-color-2': timeline.theme === 'romantic' ? '#ec4899' :
                        timeline.theme === 'elegant' ? '#64748b' :
                        timeline.theme === 'vintage' ? '#fb923c' :
                        timeline.theme === 'modern' ? '#8b5cf6' :
                        '#a855f7',
  } as React.CSSProperties

  return (
    <div className={`min-h-screen ${theme.bg}`} style={themeVars}>
      {/* Header */}
      <div className="container mx-auto px-4 py-16 md:py-20 text-center relative">
        {/* Decoração de fundo com partículas e ondas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Blobs animados */}
          <div className={`absolute top-0 left-1/4 w-64 h-64 ${theme.headerBlob1} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animate-breathe`}></div>
          <div className={`absolute top-0 right-1/4 w-64 h-64 ${theme.headerBlob2} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 animate-breathe`}></div>
          <div className={`absolute bottom-0 left-1/2 w-96 h-96 ${theme.headerBlob1} rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000 animate-parallax`}></div>
          
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient animate-breathe relative inline-block">
            <span className="relative z-10">{timeline.title}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent blur-xl opacity-50 animate-pulse"></span>
          </h1>
          {timeline.subtitle && (
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light animate-fadeInUp animate-parallax" style={{ animationDelay: '0.3s' }}>
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
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
            <button
              onClick={handleCopyUrl}
              className={`bg-white ${theme.accent} border-2 ${theme.accent.replace('text-', 'border-')} px-8 py-3 rounded-full font-semibold hover:bg-opacity-10 transition-all hover:scale-110 shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden group animate-breathe`}
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
                className={`bg-white ${theme.accent} border-2 ${theme.accent.replace('text-', 'border-')} px-8 py-3 rounded-full font-semibold hover:bg-opacity-10 transition-all hover:scale-110 shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden group animate-breathe`}
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
              <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-pink-200 relative">
                {isExample && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    ⚠️ APENAS EXEMPLO - QR Code não funcional
                  </div>
                )}
                <QRCodeSVG value={timelineUrl} size={200} />
              </div>
              {isExample && (
                <p className="mt-3 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
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
          <div className="flex items-center justify-center gap-2 text-gray-400">
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
              theme={theme}
              onMomentClick={handleMomentClick}
              getMomentImages={getMomentImages}
            />
          ) : (
            <TimelineVertical
              moments={timeline.moments}
              theme={theme}
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
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full border-4 border-white shadow-xl hidden md:block"></div>
              
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl p-10 md:p-12 text-center border-2 border-pink-200">
                <div className="mb-6">
                  <span className="text-5xl">💌</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Carta Final
                </h3>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
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

      {/* Footer */}
      {timeline.plan_type === 'essential' && (
        <footer className="container mx-auto px-4 py-8 text-center text-sm text-gray-500">
          <p>
            Criado com{' '}
            <a
              href="/"
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              Momenta
            </a>
          </p>
        </footer>
      )}
    </div>
  )
}

