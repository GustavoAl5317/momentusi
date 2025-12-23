'use client'

import { useState, useEffect, useRef } from 'react'
import { Moment } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Helper para parsear data sem problemas de timezone
// Converte string "YYYY-MM-DD" para Date no timezone local
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month é 0-indexed no Date
}

interface MomentModalProps {
  moment: Moment
  images: string[]
  isOpen: boolean
  onClose: () => void
  theme: any
}

export default function MomentModal({
  moment,
  images,
  isOpen,
  onClose,
  theme,
}: MomentModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset quando modal abre
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
      setIsAutoPlaying(true)
    }
  }, [isOpen])

  // Carrossel automático
  useEffect(() => {
    if (!isOpen || images.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isOpen, images.length, isAutoPlaying])

  if (!isOpen) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlaying(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <div className={`inline-block ${theme.dateBadge} text-white px-4 py-2 rounded-full text-sm font-semibold mb-2`}>
              {format(parseLocalDate(moment.date), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{moment.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Galeria de Fotos */}
          {images.length > 0 && (
            <div className="mb-6 relative">
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-100">
                {images[0] === '' ? (
                  // Placeholder para exemplos
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📷</div>
                      <div className="text-xl font-semibold text-gray-700 mb-2">
                        Foto {currentImageIndex + 1} de {images.length}
                      </div>
                      <div className="text-sm text-gray-500">
                        Área para exibir imagens do momento
                      </div>
                    </div>
                  </div>
                ) : (
                  // Imagens reais
                  images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentImageIndex
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${moment.title} - Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                )}

                {/* Indicadores */}
                {images.length > 1 && (
                  <>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index)
                            setIsAutoPlaying(false)
                          }}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-pink-500 w-8'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Botões de navegação */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                        >
                          ‹
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Contador */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index)
                        setIsAutoPlaying(false)
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-pink-500 scale-110'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      } ${
                        image === '' 
                          ? 'bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'
                          : ''
                      }`}
                    >
                      {image === '' ? (
                        <div className="text-2xl">📷</div>
                      ) : (
                        <img
                          src={image}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Descrição */}
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {moment.description}
          </p>

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
  )
}

