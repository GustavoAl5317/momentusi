'use client'

import { Moment } from '@/types'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useRef, useEffect, useState } from 'react'

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
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const updateScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.clientWidth * 0.85
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(newIndex)
      setScrollPosition(scrollLeft)
      setMaxScroll(container.scrollWidth - container.clientWidth)
    }

    container.addEventListener('scroll', updateScroll)
    updateScroll()

    return () => container.removeEventListener('scroll', updateScroll)
  }, [moments])

  const scrollToMoment = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = container.clientWidth * 0.85
    const scrollPosition = index * cardWidth
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    })
    setActiveIndex(index)
  }

  return (
    <div className="relative w-full py-8">

      {/* Container com scroll horizontal */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden pb-12 scrollbar-hide relative"
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
        <div className="flex gap-12 md:gap-24 px-8 md:px-16" style={{ minWidth: 'max-content' }}>
          {moments.map((moment, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={moment.id}
                className="flex-shrink-0 w-[75vw] md:w-[450px] transition-all duration-500"
                style={{
                  transform: isActive ? 'scale(1)' : 'scale(0.95)',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {/* Card do momento */}
                <div 
                  className="timeline-card animate-fadeInUp cursor-pointer group relative h-full transition-all duration-300 hover:shadow-2xl cascade-item animate-glow" 
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    '--cascade-delay': `${index * 0.1}s`,
                  } as React.CSSProperties}
                  onClick={() => onMomentClick(moment)}
                >
                  {/* Indicador de clique */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-lg z-10">
                    Clique para ver mais
                  </div>
                  
                  {/* Data destacada */}
                  <div className={`timeline-date bg-gradient-to-r ${theme.dateBadge} mb-4 relative z-10`}>
                    <span className="relative z-10">
                      {format(new Date(moment.date), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>

                  {/* Título */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight relative z-10 group-hover:scale-105 transition-transform duration-300">
                    {moment.title}
                  </h2>

                  {/* Descrição */}
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4 relative z-10 line-clamp-4 group-hover:text-gray-900 transition-colors duration-300">
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
                                  <div className="text-[10px] text-gray-500 font-medium">Foto {idx + 1}</div>
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
                              <div key={idx} className="relative overflow-hidden rounded-lg aspect-square">
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

      {/* Indicadores de scroll (setas) com animação */}
      {maxScroll > 0 && (
        <>
          {scrollPosition > 10 && (
            <button
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: -500, behavior: 'smooth' })
              }}
              className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 w-14 h-14 rounded-full items-center justify-center shadow-xl transition-all hover:scale-110 z-30 border-2 border-gray-200 backdrop-blur-sm animate-pulse"
              style={{ top: '50%' }}
            >
              <span className="text-2xl font-bold">‹</span>
            </button>
          )}
          {scrollPosition < maxScroll - 10 && (
            <button
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: 500, behavior: 'smooth' })
              }}
              className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 w-14 h-14 rounded-full items-center justify-center shadow-xl transition-all hover:scale-110 z-30 border-2 border-gray-200 backdrop-blur-sm animate-pulse"
              style={{ top: '50%' }}
            >
              <span className="text-2xl font-bold">›</span>
            </button>
          )}
        </>
      )}

      {/* Indicador de scroll (mobile) com animação */}
      {maxScroll > 0 && (
        <div className="text-center mt-6 text-sm text-gray-500 animate-bounce">
          <span className="inline-flex items-center gap-2">
            <span className="text-lg">←</span>
            <span>Deslize para explorar os momentos</span>
            <span className="text-lg">→</span>
          </span>
        </div>
      )}
    </div>
  )
}
