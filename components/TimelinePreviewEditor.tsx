'use client'

import { useState } from 'react'
import { Moment, TimelineLayout } from '@/types'
import TimelineVertical from './TimelineVertical'
import TimelineHorizontal from './TimelineHorizontal'
import MomentModal from './MomentModal'

interface TimelinePreviewEditorProps {
  title: string
  subtitle?: string
  theme: string
  layout: TimelineLayout
  moments: Moment[]
  plan: 'essential' | 'complete'
  finalMessage?: string
  customColors?: {
    primary?: string
    secondary?: string
    background?: string
    text?: string
    card?: string
    title?: string
    border?: string
    button?: string
    badge?: string
  }
}

export default function TimelinePreviewEditor({
  title,
  subtitle,
  theme,
  layout,
  moments,
  plan,
  finalMessage,
  customColors,
}: TimelinePreviewEditorProps) {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Temas profissionais com cores harmoniosas e bordas brilhantes
  const themeStyles = {
    default: {
      bg: 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800',
      bgPattern: '',
      headerBlob1: 'bg-blue-500/10',
      headerBlob2: 'bg-indigo-500/10',
      headerBlob3: '',
      dateBadge: 'bg-blue-600/90 text-white border-2 border-blue-400/80 shadow-lg shadow-blue-500/30',
      markerColor1: '#3b82f6',
      markerColor2: '#6366f1',
      lineColor1: '#3b82f6',
      lineColor2: '#6366f1',
      accent: 'text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/50',
      cardStyle: 'bg-slate-800/95 backdrop-blur-sm shadow-2xl border-2 border-blue-400/60 glow-blue',
      titleGradient: 'from-blue-300 to-indigo-300',
    },
    romantic: {
      bg: 'bg-gradient-to-b from-rose-800 via-pink-900 to-rose-800',
      bgPattern: '',
      headerBlob1: 'bg-rose-500/10',
      headerBlob2: 'bg-pink-500/10',
      headerBlob3: '',
      dateBadge: 'bg-rose-600/90 text-white border-2 border-rose-400/80 shadow-lg shadow-rose-500/30',
      markerColor1: '#f43f5e',
      markerColor2: '#fb7185',
      lineColor1: '#f43f5e',
      lineColor2: '#fb7185',
      accent: 'text-rose-300',
      button: 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/50',
      cardStyle: 'bg-rose-900/95 backdrop-blur-sm shadow-2xl border-2 border-rose-400/60 glow-rose',
      titleGradient: 'from-rose-300 to-pink-300',
    },
    modern: {
      bg: 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800',
      bgPattern: '',
      headerBlob1: 'bg-emerald-500/10',
      headerBlob2: 'bg-teal-500/10',
      headerBlob3: '',
      dateBadge: 'bg-emerald-600/90 text-white border-2 border-emerald-400/80 shadow-lg shadow-emerald-500/30',
      markerColor1: '#10b981',
      markerColor2: '#14b8a6',
      lineColor1: '#10b981',
      lineColor2: '#14b8a6',
      accent: 'text-emerald-300',
      button: 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/50',
      cardStyle: 'bg-slate-800/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-400/60 glow-emerald',
      titleGradient: 'from-emerald-300 to-teal-300',
    },
    elegant: {
      bg: 'bg-gradient-to-b from-slate-800 via-zinc-900 to-slate-800',
      bgPattern: '',
      headerBlob1: 'bg-amber-500/10',
      headerBlob2: 'bg-yellow-500/10',
      headerBlob3: '',
      dateBadge: 'bg-amber-600/90 text-white border-2 border-amber-400/80 shadow-lg shadow-amber-500/30',
      markerColor1: '#fbbf24',
      markerColor2: '#f59e0b',
      lineColor1: '#fbbf24',
      lineColor2: '#f59e0b',
      accent: 'text-amber-300',
      button: 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-500/50',
      cardStyle: 'bg-slate-800/95 backdrop-blur-sm shadow-2xl border-2 border-amber-400/60 glow-amber',
      titleGradient: 'from-amber-300 to-yellow-300',
    },
    vintage: {
      bg: 'bg-gradient-to-b from-amber-800 via-orange-900 to-amber-800',
      bgPattern: '',
      headerBlob1: 'bg-orange-500/10',
      headerBlob2: 'bg-amber-500/10',
      headerBlob3: '',
      dateBadge: 'bg-orange-600/90 text-white border-2 border-orange-400/80 shadow-lg shadow-orange-500/30',
      markerColor1: '#fb923c',
      markerColor2: '#f97316',
      lineColor1: '#fb923c',
      lineColor2: '#f97316',
      accent: 'text-orange-300',
      button: 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-500/50',
      cardStyle: 'bg-amber-900/95 backdrop-blur-sm shadow-2xl border-2 border-orange-400/60 glow-orange',
      titleGradient: 'from-orange-300 to-amber-300',
    },
  }

  const baseTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.default
  
  // Se tiver cores customizadas, aplicar elas
  const themeVars = customColors ? {
    ...baseTheme,
    cardStyle: `bg-slate-800/95 backdrop-blur-sm shadow-2xl border-2 custom-glow`,
    markerColor1: customColors.primary || baseTheme.markerColor1,
    markerColor2: customColors.secondary || baseTheme.markerColor2,
    lineColor1: customColors.primary || baseTheme.lineColor1,
    lineColor2: customColors.secondary || baseTheme.lineColor2,
    accent: 'text-white',
    titleGradient: `from-[${customColors.primary || '#60a5fa'}] to-[${customColors.secondary || '#818cf8'}]`,
  } : baseTheme

  // Variáveis CSS para cores customizadas com glow dinâmico
  const customStyleVars: Record<string, string> = customColors ? {
    '--custom-primary': customColors.primary || '#3b82f6',
    '--custom-secondary': customColors.secondary || '#6366f1',
    '--custom-background': customColors.background || '',
    '--custom-text': customColors.text || '',
    '--custom-card': customColors.card || '',
    '--custom-glow-color': customColors.primary || '#3b82f6',
  } : {}

  const getMomentImages = (moment: Moment): string[] => {
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

  const handleMomentClick = (moment: Moment) => {
    setSelectedMoment(moment)
    setIsModalOpen(true)
  }

  if (!title || moments.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-12 text-center border-2 border-dashed border-slate-600">
        <div className="text-6xl mb-4">👀</div>
        <h3 className="text-2xl font-bold text-slate-200 mb-2">Preview</h3>
        <p className="text-slate-300">
          Adicione um título e pelo menos um momento para ver o preview
        </p>
      </div>
    )
  }

  return (
    <div 
      className={`min-h-screen ${customColors?.background ? '' : themeVars.bg} relative`} 
      style={{
        '--line-color-1': themeVars.lineColor1,
        '--line-color-2': themeVars.lineColor2,
        '--marker-color-1': themeVars.markerColor1,
        '--marker-color-2': themeVars.markerColor2,
        '--custom-glow-color': customColors?.primary || '#3b82f6',
        backgroundImage: themeVars.bgPattern,
        backgroundColor: customColors?.background || undefined,
        color: customColors?.text || undefined,
        ...customStyleVars,
      } as React.CSSProperties & { '--custom-glow-color'?: string }}
    >
      {/* Header com efeitos visuais melhorados */}
      <div className="container mx-auto px-4 py-12 md:py-16 text-center relative overflow-hidden">
        {/* Blobs animados com mais camadas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 left-1/4 w-72 h-72 ${themeVars.headerBlob1} rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob`}></div>
          <div className={`absolute top-0 right-1/4 w-80 h-80 ${themeVars.headerBlob2} rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000`}></div>
          <div className={`absolute bottom-0 left-1/2 w-64 h-64 ${themeVars.headerBlob3} rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000`}></div>
        </div>

        {/* Padrão decorativo sutil */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>

        <div className="relative z-10">
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${customColors?.title ? 'neon-text' : `bg-gradient-to-r ${themeVars.titleGradient} bg-clip-text text-transparent`} bg-size-200 animate-gradient drop-shadow-sm`}
            style={customColors?.title ? {
              color: customColors.title,
              textShadow: `0 0 20px ${customColors.title}80, 0 0 40px ${customColors.title}40, 0 0 60px ${customColors.title}20`,
            } : {}}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="text-lg md:text-xl mb-8 font-light tracking-wide"
              style={customColors?.text ? { color: customColors.text } : { color: '#e2e8f0' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 pb-12">
        {layout === 'horizontal' ? (
          <TimelineHorizontal
            moments={moments}
            theme={{ ...themeVars, customColors, cardStyle: customColors ? undefined : themeVars.cardStyle }}
            onMomentClick={handleMomentClick}
            getMomentImages={getMomentImages}
          />
        ) : (
          <TimelineVertical
            moments={moments}
            theme={{ ...themeVars, customColors, cardStyle: customColors ? undefined : themeVars.cardStyle }}
            onMomentClick={handleMomentClick}
            getMomentImages={getMomentImages}
          />
        )}

        {/* Carta Final com design melhorado */}
        {finalMessage && (
          <div className="max-w-3xl mx-auto mt-20 mb-12">
            <div className="relative">
              {/* Marcador decorativo superior */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full border-4 border-slate-800 shadow-2xl hidden md:block animate-pulse"></div>
              
              {/* Card principal com efeitos visuais */}
              <div className={`${themeVars.cardStyle} rounded-3xl shadow-2xl p-10 md:p-12 text-center border-2 relative overflow-hidden`}>
                {/* Efeito de brilho sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
                
                {/* Padrão decorativo de fundo */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)',
                }}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform transition-transform duration-300 hover:scale-110 inline-block">
                    <span className="text-5xl md:text-6xl animate-float">💌</span>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${themeVars.titleGradient} bg-clip-text text-transparent mb-6 bg-size-200 animate-gradient`}>
                    Carta Final
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto mb-6"></div>
                  <p className="text-slate-100 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                    {finalMessage}
                  </p>
                </div>
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
          theme={themeVars}
        />
      )}
    </div>
  )
}

