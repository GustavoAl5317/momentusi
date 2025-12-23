'use client'

import { Moment } from '@/types'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useEffect, useRef, useState } from 'react'

interface TimelineVerticalProps {
  moments: Moment[]
  theme: any
  onMomentClick: (moment: Moment) => void
  getMomentImages: (moment: Moment) => string[]
}

export default function TimelineVertical({
  moments,
  theme,
  onMomentClick,
  getMomentImages,
}: TimelineVerticalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineHeight, setLineHeight] = useState('100%')
  const [lineTop, setLineTop] = useState(0)

  useEffect(() => {
    const updateLineHeight = () => {
      if (containerRef.current) {
        // Calcular altura baseada no conteúdo dos momentos, não no scrollHeight
        const momentsContainer = containerRef.current.querySelector('.space-y-16')
        if (momentsContainer) {
          const firstMarker = momentsContainer.querySelector('.timeline-marker') as HTMLElement
          const lastMarker = Array.from(momentsContainer.querySelectorAll('.timeline-marker')).pop() as HTMLElement
          
          if (firstMarker && lastMarker) {
            // Calcular posição do centro dos marcadores
            // Como os marcadores estão centralizados verticalmente (top: 50%, transform: translateY(-50%))
            // precisamos calcular a posição real do centro
            const firstMarkerRect = firstMarker.getBoundingClientRect()
            const lastMarkerRect = lastMarker.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()
            
            // Posição do centro do primeiro marcador relativo ao container
            const firstCenter = (firstMarkerRect.top + firstMarkerRect.height / 2) - containerRect.top
            // Posição do centro do último marcador relativo ao container
            const lastCenter = (lastMarkerRect.top + lastMarkerRect.height / 2) - containerRect.top
            
            setLineTop(firstCenter)
            setLineHeight(`${lastCenter - firstCenter}px`)
          } else {
            // Fallback: usar altura do container se não encontrar marcadores
            setLineTop(0)
            setLineHeight(`${momentsContainer.scrollHeight}px`)
          }
        }
      }
    }

    // Usar requestAnimationFrame para garantir que o cálculo seja feito após a renderização
    const rafId = requestAnimationFrame(() => {
      updateLineHeight()
      // Também atualizar após um pequeno delay para garantir que tudo foi renderizado
      setTimeout(updateLineHeight, 100)
    })
    
    window.addEventListener('resize', updateLineHeight)

    return () => {
      window.removeEventListener('resize', updateLineHeight)
      cancelAnimationFrame(rafId)
    }
  }, [moments])

  return (
    <div ref={containerRef} className="timeline-container relative max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Linha vertical da timeline - posicionada absolutamente para não ocupar espaço */}
      <div 
        className="timeline-line timeline-line-theme hidden md:block"
        style={{
          background: `linear-gradient(to bottom, var(--line-color-1), var(--line-color-2), var(--line-color-1))`,
          zIndex: 1,
          height: lineHeight,
          top: `${lineTop}px`,
        }}
      ></div>

      {/* Momentos */}
      <div className="space-y-12 sm:space-y-16 md:space-y-20 relative z-10">
        {moments.map((moment, index) => (
          <div
            key={moment.id}
            className="timeline-item relative z-10"
          >
            {/* Marcador na linha */}
            <div 
              className="timeline-marker hidden md:block z-20"
              style={{
                background: `linear-gradient(135deg, var(--marker-color-1), var(--marker-color-2))`,
              }}
            ></div>

            {/* Card do momento */}
            <div className={`relative w-full max-w-full mx-auto md:w-[calc(50%-3rem)] ${
              index % 2 === 0 
                ? 'md:ml-auto md:mr-0 md:pl-8' 
                : 'md:ml-0 md:mr-auto md:pr-8'
            }`}>
              <div 
                className={`timeline-card animate-fadeInUp cursor-pointer group relative w-full ${theme.cardStyle || 'bg-slate-800/90 backdrop-blur-sm border-pink-500/30 shadow-xl'}`}
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  borderColor: theme.cardStyle ? undefined : 'rgba(236, 72, 153, 0.2)',
                } as React.CSSProperties}
                onClick={() => onMomentClick(moment)}
              >
                {/* Indicador de clique */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold text-pink-300 shadow-lg z-30">
                  <span className="hidden sm:inline">Clique para ver mais</span>
                  <span className="sm:hidden">Ver mais</span>
                </div>
                
                {/* Data destacada */}
                <div className={`timeline-date ${theme.dateBadge || 'bg-purple-600 text-white border-2 border-purple-400'} relative z-10 text-xs sm:text-sm md:text-base`}>
                  <span className="relative z-10">
                    {format(new Date(moment.date), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>

                {/* Título */}
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight group-hover:scale-105 transition-transform duration-300 relative z-10 break-words overflow-wrap-anywhere px-0">
                  {moment.title}
                </h2>

                {/* Descrição */}
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg mb-4 sm:mb-6 group-hover:text-gray-100 transition-colors duration-300 relative z-10 break-words whitespace-pre-wrap overflow-wrap-anywhere px-0">
                  {moment.description}
                </p>

                {/* Galeria de Imagens (Preview) */}
                {(() => {
                  const images = getMomentImages(moment)
                  const isExample = images.length > 0 && images[0] === ''
                  
                  if (isExample) {
                    return (
                      <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {[0, 1, 2].map((idx) => (
                            <div 
                              key={idx} 
                              className="relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center"
                            >
                              <div className="text-center">
                                <div className="text-xl sm:text-3xl mb-1">📷</div>
                                <div className="text-xs text-gray-500 font-medium">Foto {idx + 1}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
                          Clique para ver todas as 3 fotos
                        </p>
                      </div>
                    )
                  }
                  
                  if (images.length === 0) return null
                  
                  return (
                    <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
                      {images.length === 1 ? (
                        <div className="overflow-hidden rounded-lg sm:rounded-xl">
                          <img
                            src={images[0]}
                            alt={moment.title}
                            className="w-full h-auto max-h-64 sm:max-h-96 object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {images.slice(0, 3).map((img, idx) => (
                            <div key={idx} className="relative overflow-hidden rounded-lg aspect-square">
                              <img
                                src={img}
                                alt={`${moment.title} - Foto ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                              {idx === 2 && images.length > 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                                  +{images.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {images.length > 1 && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
                          Clique para ver todas as {images.length} fotos
                        </p>
                      )}
                    </div>
                  )
                })()}

                {/* Música */}
                {moment.music_url && (
                  <div className="mt-6">
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
          </div>
        ))}
      </div>
    </div>
  )
}

