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
}

export default function TimelinePreviewEditor({
  title,
  subtitle,
  theme,
  layout,
  moments,
  plan,
  finalMessage,
}: TimelinePreviewEditorProps) {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Obter tema visual - cores sólidas e vibrantes
  const themeStyles = {
    default: {
      bg: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950',
      bgPattern: '',
      headerBlob1: 'bg-purple-600/20',
      headerBlob2: 'bg-indigo-600/20',
      headerBlob3: '',
      dateBadge: 'bg-purple-600 text-white border-2 border-purple-400',
      markerColor1: '#9333ea',
      markerColor2: '#6366f1',
      lineColor1: '#9333ea',
      lineColor2: '#6366f1',
      accent: 'text-purple-300',
      button: 'bg-purple-600 hover:bg-purple-700',
      cardStyle: 'bg-indigo-900 shadow-xl border-2 border-indigo-600',
      titleGradient: 'from-purple-300 to-indigo-300',
    },
    romantic: {
      bg: 'bg-gradient-to-b from-rose-900 via-pink-900 to-rose-900',
      bgPattern: '',
      headerBlob1: 'bg-pink-600/20',
      headerBlob2: 'bg-rose-600/20',
      headerBlob3: '',
      dateBadge: 'bg-pink-600 text-white border-2 border-pink-400',
      markerColor1: '#ec4899',
      markerColor2: '#f43f5e',
      lineColor1: '#ec4899',
      lineColor2: '#f43f5e',
      accent: 'text-pink-300',
      button: 'bg-pink-600 hover:bg-pink-700',
      cardStyle: 'bg-rose-800 shadow-xl border-2 border-rose-500',
      titleGradient: 'from-pink-300 to-rose-300',
    },
    modern: {
      bg: 'bg-gradient-to-b from-cyan-950 via-blue-950 to-cyan-950',
      bgPattern: '',
      headerBlob1: 'bg-sky-600/20',
      headerBlob2: 'bg-cyan-600/20',
      headerBlob3: '',
      dateBadge: 'bg-sky-600 text-white border-2 border-sky-400',
      markerColor1: '#0ea5e9',
      markerColor2: '#06b6d4',
      lineColor1: '#0ea5e9',
      lineColor2: '#06b6d4',
      accent: 'text-sky-300',
      button: 'bg-sky-600 hover:bg-sky-700',
      cardStyle: 'bg-cyan-900 shadow-xl border-2 border-cyan-500',
      titleGradient: 'from-sky-300 to-cyan-300',
    },
    elegant: {
      bg: 'bg-gradient-to-b from-slate-800 via-gray-800 to-slate-800',
      bgPattern: '',
      headerBlob1: 'bg-gray-600/20',
      headerBlob2: 'bg-slate-600/20',
      headerBlob3: '',
      dateBadge: 'bg-gray-700 text-white border-2 border-gray-500',
      markerColor1: '#64748b',
      markerColor2: '#475569',
      lineColor1: '#64748b',
      lineColor2: '#475569',
      accent: 'text-slate-200',
      button: 'bg-gray-700 hover:bg-gray-800',
      cardStyle: 'bg-slate-700 shadow-xl border-2 border-slate-500',
      titleGradient: 'from-gray-300 to-slate-300',
    },
    vintage: {
      bg: 'bg-gradient-to-b from-amber-900 via-orange-900 to-amber-900',
      bgPattern: '',
      headerBlob1: 'bg-orange-600/20',
      headerBlob2: 'bg-amber-600/20',
      headerBlob3: '',
      dateBadge: 'bg-orange-600 text-white border-2 border-orange-400',
      markerColor1: '#fb923c',
      markerColor2: '#d97706',
      lineColor1: '#fb923c',
      lineColor2: '#d97706',
      accent: 'text-orange-300',
      button: 'bg-orange-600 hover:bg-orange-700',
      cardStyle: 'bg-amber-800 shadow-xl border-2 border-amber-500',
      titleGradient: 'from-orange-300 to-amber-300',
    },
  }

  const themeVars = themeStyles[theme as keyof typeof themeStyles] || themeStyles.default

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
      className={`min-h-screen ${themeVars.bg} relative`} 
      style={{
        '--line-color-1': themeVars.lineColor1,
        '--line-color-2': themeVars.lineColor2,
        '--marker-color-1': themeVars.markerColor1,
        '--marker-color-2': themeVars.markerColor2,
        backgroundImage: themeVars.bgPattern,
      } as React.CSSProperties}
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
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r ${themeVars.titleGradient} bg-clip-text text-transparent bg-size-200 animate-gradient drop-shadow-sm`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-slate-200 mb-8 font-light tracking-wide">
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
            theme={themeVars}
            onMomentClick={handleMomentClick}
            getMomentImages={getMomentImages}
          />
        ) : (
          <TimelineVertical
            moments={moments}
            theme={themeVars}
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

