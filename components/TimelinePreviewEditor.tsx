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

  // Obter tema visual com estilos mais criativos
  const themeStyles = {
    default: {
      bg: 'bg-gradient-to-br from-pink-50 via-purple-50 via-white to-pink-50',
      bgPattern: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
      headerBlob1: 'bg-pink-300',
      headerBlob2: 'bg-purple-300',
      headerBlob3: 'bg-fuchsia-300',
      dateBadge: 'from-pink-500 via-purple-500 to-pink-500',
      markerColor1: '#ec4899',
      markerColor2: '#a855f7',
      lineColor1: '#ec4899',
      lineColor2: '#a855f7',
      accent: 'text-pink-600',
      button: 'bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600',
      cardStyle: 'bg-white/90 backdrop-blur-sm border-pink-200/50 shadow-pink-100',
      titleGradient: 'from-pink-600 via-purple-600 to-pink-600',
    },
    romantic: {
      bg: 'bg-gradient-to-br from-rose-50 via-pink-50 via-rose-50 to-pink-50',
      bgPattern: 'radial-gradient(circle at 30% 40%, rgba(244, 63, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
      headerBlob1: 'bg-rose-300',
      headerBlob2: 'bg-pink-300',
      headerBlob3: 'bg-red-200',
      dateBadge: 'from-rose-500 via-pink-500 to-rose-500',
      markerColor1: '#f43f5e',
      markerColor2: '#ec4899',
      lineColor1: '#f43f5e',
      lineColor2: '#ec4899',
      accent: 'text-rose-600',
      button: 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600',
      cardStyle: 'bg-white/90 backdrop-blur-sm border-rose-200/50 shadow-rose-100',
      titleGradient: 'from-rose-600 via-pink-600 to-rose-600',
    },
    modern: {
      bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 via-sky-50 to-blue-50',
      bgPattern: 'radial-gradient(circle at 25% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
      headerBlob1: 'bg-blue-300',
      headerBlob2: 'bg-cyan-300',
      headerBlob3: 'bg-sky-300',
      dateBadge: 'from-blue-500 via-cyan-500 to-blue-500',
      markerColor1: '#3b82f6',
      markerColor2: '#06b6d4',
      lineColor1: '#3b82f6',
      lineColor2: '#06b6d4',
      accent: 'text-blue-600',
      button: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600',
      cardStyle: 'bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-blue-100',
      titleGradient: 'from-blue-600 via-cyan-600 to-blue-600',
    },
    elegant: {
      bg: 'bg-gradient-to-br from-slate-50 via-gray-50 via-zinc-50 to-slate-50',
      bgPattern: 'radial-gradient(circle at 20% 30%, rgba(71, 85, 105, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 116, 139, 0.08) 0%, transparent 50%)',
      headerBlob1: 'bg-slate-300',
      headerBlob2: 'bg-gray-300',
      headerBlob3: 'bg-zinc-300',
      dateBadge: 'from-slate-600 via-gray-600 to-slate-600',
      markerColor1: '#475569',
      markerColor2: '#64748b',
      lineColor1: '#475569',
      lineColor2: '#64748b',
      accent: 'text-slate-700',
      button: 'bg-gradient-to-r from-slate-700 via-gray-700 to-slate-700',
      cardStyle: 'bg-white/95 backdrop-blur-sm border-slate-200/60 shadow-slate-200',
      titleGradient: 'from-slate-700 via-gray-700 to-slate-700',
    },
    vintage: {
      bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 via-orange-50 to-amber-50',
      bgPattern: 'radial-gradient(circle at 30% 50%, rgba(217, 119, 6, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(234, 179, 8, 0.12) 0%, transparent 50%)',
      headerBlob1: 'bg-amber-300',
      headerBlob2: 'bg-yellow-300',
      headerBlob3: 'bg-orange-200',
      dateBadge: 'from-amber-600 via-yellow-600 to-amber-600',
      markerColor1: '#d97706',
      markerColor2: '#eab308',
      lineColor1: '#d97706',
      lineColor2: '#eab308',
      accent: 'text-amber-700',
      button: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600',
      cardStyle: 'bg-white/90 backdrop-blur-sm border-amber-200/50 shadow-amber-100',
      titleGradient: 'from-amber-700 via-yellow-600 to-amber-700',
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">👀</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">Preview</h3>
        <p className="text-gray-500">
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
            <p className="text-lg md:text-xl text-gray-700 mb-8 font-light tracking-wide">
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
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full border-4 border-white shadow-2xl hidden md:block animate-pulse"></div>
              
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
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
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

