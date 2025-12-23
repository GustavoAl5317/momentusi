'use client'

import { Moment } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRef, useState, useEffect } from 'react'

// Helper para converter hex para rgba
const hexToRgba = (hex: string, alpha: number = 1): string => {
  // espera #RRGGBB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Helper para criar glow dinâmico
const createGlowShadow = (color: string): string => {
  return `0 0 20px ${hexToRgba(color, 0.3)}, 0 0 40px ${hexToRgba(
    color,
    0.15
  )}, inset 0 0 20px ${hexToRgba(color, 0.1)}`
}

// Helper para parsear data sem problemas de timezone
// Converte string "YYYY-MM-DD" para Date no timezone local
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month é 0-indexed no Date
}

interface TimelineHorizontalProps {
  moments: Moment[]
  theme: any
  onMomentClick: (moment: Moment) => void
  getMomentImages: (moment: Moment) => string[]
}

export default function TimelineHorizontal({
  moments,
  theme,
  onMomentClick,
  getMomentImages,
}: TimelineHorizontalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const updateArrows = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }

    updateArrows()
    container.addEventListener('scroll', updateArrows)
    window.addEventListener('resize', updateArrows)

    return () => {
      container.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [moments])

  const glowColor =
    theme?.customColors?.border ||
    theme?.customColors?.primary ||
    '#3b82f6'

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      // Calcular largura baseada no tamanho real dos cards
      const isMobile = window.innerWidth < 640
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 768
      const cardWidth = isMobile 
        ? container.clientWidth * 0.85 
        : isTablet 
        ? container.clientWidth * 0.75 
        : 450 // md:w-[450px]
      
      container.scrollBy({
        left: -cardWidth - 24, // incluir gap
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      // Calcular largura baseada no tamanho real dos cards
      const isMobile = window.innerWidth < 640
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 768
      const cardWidth = isMobile 
        ? container.clientWidth * 0.85 
        : isTablet 
        ? container.clientWidth * 0.75 
        : 450 // md:w-[450px]
      
      container.scrollBy({
        left: cardWidth + 24, // incluir gap
        behavior: 'smooth',
      })
    }
  }

  return (
    <div 
      className="relative w-full py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botão esquerdo - clicável - apenas desktop e no hover */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className={`hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-30 cursor-pointer hover:scale-110 transition-all duration-300 items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border-2 shadow-lg ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundColor: `${glowColor}20`,
            borderColor: glowColor,
            color: glowColor,
            boxShadow: `0 0 15px ${glowColor}60, inset 0 0 8px ${glowColor}20`,
          }}
          aria-label="Voltar"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce-horizontal-left"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Botão direito - clicável - apenas desktop e no hover */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className={`hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-30 cursor-pointer hover:scale-110 transition-all duration-300 items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border-2 shadow-lg ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundColor: `${glowColor}20`,
            borderColor: glowColor,
            color: glowColor,
            boxShadow: `0 0 15px ${glowColor}60, inset 0 0 8px ${glowColor}20`,
          }}
          aria-label="Avançar"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce-horizontal"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Container com scroll horizontal */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-scroll overflow-y-hidden pb-12 scrollbar-hide relative md:mx-12"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Container interno com os momentos */}
        <div
          className="flex gap-6 sm:gap-12 md:gap-24 px-4 sm:px-8 md:px-16"
          style={{ minWidth: 'max-content' }}
        >
          {moments.map((moment, index) => {
            const hasCustom = !!theme?.customColors
            const glowColor =
              theme?.customColors?.border ||
              theme?.customColors?.primary ||
              '#3b82f6'

            return (
              <div
                key={moment.id}
                className="flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-[450px]"
              >
                {/* Card do momento */}
                <div
                  className={[
                    'timeline-card animate-fadeInUp cursor-pointer group relative h-full transition-all duration-300 hover:shadow-2xl cascade-item animate-glow',
                    hasCustom
                      ? 'custom-glow'
                      : theme?.cardStyle ||
                        'bg-slate-800/90 backdrop-blur-sm border-2 border-pink-500 shadow-xl glow-rose',
                  ].join(' ')}
                  style={
                    {
                      animationDelay: `${index * 0.1}s`,
                      '--cascade-delay': `${index * 0.1}s`,
                      backgroundColor: theme?.customColors?.card || undefined,
                      borderColor: theme?.customColors?.border
                        ? `${theme.customColors.border}99`
                        : theme?.customColors?.primary
                          ? `${theme.customColors.primary}99`
                          : undefined,
                      '--custom-glow-color': glowColor,
                      boxShadow:
                        theme?.customColors?.border || theme?.customColors?.primary
                          ? createGlowShadow(glowColor)
                          : undefined,
                    } as React.CSSProperties & { '--custom-glow-color'?: string }
                  }
                  onClick={() => onMomentClick(moment)}
                >
                  {/* Indicador de clique */}
                  <div
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${
                      theme?.accent || 'text-pink-300'
                    } shadow-lg z-10`}
                  >
                    <span className="hidden sm:inline">Clique para ver mais</span>
                    <span className="sm:hidden">Ver mais</span>
                  </div>

                  {/* Data destacada */}
                  <div
                    className={[
                      'timeline-date mb-3 sm:mb-4 relative z-10 text-xs sm:text-sm md:text-base',
                      theme?.customColors?.badge
                        ? 'neon-badge'
                        : theme?.dateBadge ||
                          'bg-purple-600 text-white border-2 border-purple-400',
                    ].join(' ')}
                    style={
                      theme?.customColors?.badge
                        ? {
                            backgroundColor: `${theme.customColors.badge}E6`,
                            borderColor: `${theme.customColors.badge}CC`,
                            boxShadow: `0 0 15px ${theme.customColors.badge}80, 0 0 30px ${theme.customColors.badge}40, inset 0 0 10px ${theme.customColors.badge}20`,
                          }
                        : undefined
                    }
                  >
                    <span className="relative z-10">
                      {format(parseLocalDate(moment.date), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>

                  {/* Título */}
                  <h2
                    className={[
                      'text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight relative z-10 group-hover:scale-105 transition-transform duration-300 break-words',
                      theme?.customColors?.title ? 'neon-text' : 'text-white',
                    ].join(' ')}
                    style={
                      theme?.customColors?.title
                        ? {
                            color: theme.customColors.title,
                            textShadow: `0 0 20px ${theme.customColors.title}80, 0 0 40px ${theme.customColors.title}40, 0 0 60px ${theme.customColors.title}20`,
                          }
                        : undefined
                    }
                  >
                    {moment.title}
                  </h2>

                  {/* Descrição */}
                  <p
                    className={[
                      'leading-relaxed text-sm md:text-base mb-3 sm:mb-4 relative z-10 line-clamp-3 sm:line-clamp-4 group-hover:opacity-90 transition-colors duration-300 break-words',
                      theme?.customColors?.text
                        ? ''
                        : 'text-gray-300 group-hover:text-gray-100',
                    ].join(' ')}
                    style={
                      theme?.customColors?.text
                        ? { color: theme.customColors.text }
                        : undefined
                    }
                  >
                    {moment.description}
                  </p>

                  {/* Galeria de Imagens (Preview) */}
                  {(() => {
                    const images = getMomentImages(moment)
                    const isExample = images.length > 0 && images[0] === ''

                    if (isExample) {
                      return (
                        <div className="mt-4 mb-4 relative z-10">
                          <div className="grid grid-cols-3 gap-1.5">
                            {[0, 1, 2].map((idx) => (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                              >
                                <div className="text-center">
                                  <div className="text-2xl mb-0.5">📷</div>
                                  <div className="text-[10px] text-gray-500 font-medium">
                                    Foto {idx + 1}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 text-center">
                            Clique para ver todas as 3 fotos
                          </p>
                        </div>
                      )
                    }

                    if (images.length === 0) return null

                    return (
                      <div className="mt-4 mb-4 relative z-10">
                        {images.length === 1 ? (
                          <div className="overflow-hidden rounded-xl">
                            <img
                              src={images[0]}
                              alt={moment.title}
                              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {images.slice(0, 3).map((img, idx) => (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-lg aspect-square"
                              >
                                <img
                                  src={img}
                                  alt={`${moment.title} - Foto ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                                {idx === 2 && images.length > 3 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                                    +{images.length - 3}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {images.length > 1 && (
                          <p className="text-xs text-gray-500 mt-1.5 text-center">
                            Clique para ver todas as {images.length} fotos
                          </p>
                        )}
                      </div>
                    )
                  })()}

                  {/* Música */}
                  {moment.music_url && (
                    <div className="mt-4 relative z-10">
                      {moment.music_url.includes('spotify.com') ? (
                        <div className="rounded-xl overflow-hidden shadow-md">
                          <iframe
                            src={moment.music_url.replace(
                              'open.spotify.com',
                              'open.spotify.com/embed'
                            )}
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allow="encrypted-media"
                            className="rounded-xl"
                          />
                        </div>
                      ) : moment.music_url.includes('youtube.com') ||
                        moment.music_url.includes('youtu.be') ? (
                        <div className="rounded-xl overflow-hidden shadow-md">
                          <iframe
                            src={moment.music_url.replace(
                              /(youtube.com\/watch\?v=|youtu.be\/)/,
                              'youtube.com/embed/'
                            )}
                            width="100%"
                            height="315"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-xl"
                          />
                        </div>
                      ) : (
                        <a
                          href={moment.music_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                        >
                          <span className="text-2xl">🎵</span>
                          <span>Ouvir música</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
