'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

interface TimelinePreviewProps {
  timeline: {
    id: string
    slug: string
    title: string
    subtitle?: string
    theme: string
    moments: Array<{
      date: string
      title: string
      description: string
    }>
  }
}

const themeStyles = {
  default: {
    bg: 'bg-gradient-to-br from-pink-50 to-purple-50',
    border: 'border-pink-200',
    accent: 'text-pink-600',
    button: 'bg-pink-600 hover:bg-pink-700',
  },
  romantic: {
    bg: 'bg-gradient-to-br from-rose-100 to-pink-100',
    border: 'border-rose-300',
    accent: 'text-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700',
  },
  elegant: {
    bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
    border: 'border-gray-300',
    accent: 'text-gray-700',
    button: 'bg-gray-700 hover:bg-gray-800',
  },
  vintage: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-300',
    accent: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700',
  },
  modern: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    border: 'border-indigo-300',
    accent: 'text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700',
  },
}

export default function TimelinePreview({ timeline }: TimelinePreviewProps) {
  const theme = themeStyles[timeline.theme as keyof typeof themeStyles] || themeStyles.default

  return (
    <div
      className={`${theme.bg} rounded-3xl shadow-xl overflow-hidden border-2 ${theme.border} hover:shadow-2xl transition-all hover:scale-105 group`}
    >
      {/* Header do Preview */}
      <div className="p-6 border-b-2 border-white/50">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform">
          {timeline.title}
        </h3>
        {timeline.subtitle && (
          <p className="text-gray-600 font-medium">{timeline.subtitle}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-xs font-semibold ${theme.accent} bg-white/80 px-3 py-1 rounded-full`}>
            {timeline.theme === 'romantic' && '💕 Romântico'}
            {timeline.theme === 'elegant' && '👔 Elegante'}
            {timeline.theme === 'vintage' && '📷 Vintage'}
            {timeline.theme === 'modern' && '🚀 Moderno'}
            {timeline.theme === 'default' && '✨ Padrão'}
          </span>
        </div>
      </div>

      {/* Preview da Timeline */}
      <div className="p-6 space-y-4">
        {timeline.moments.slice(0, 3).map((moment, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:scale-105 transition-transform"
          >
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${theme.button.replace('hover:bg-', 'bg-')} flex-shrink-0 mt-1`}></div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {format(new Date(moment.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {moment.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {moment.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        {timeline.moments.length > 3 && (
          <div className="text-center text-sm text-gray-500">
            +{timeline.moments.length - 3} momentos
          </div>
        )}
      </div>

      {/* Footer com botão */}
      <div className="p-6 bg-white/50 border-t-2 border-white/50">
        <Link
          href={`/exemplo-${timeline.slug}`}
          className={`block w-full ${theme.button} text-white text-center py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl`}
        >
          Ver Timeline Completa →
        </Link>
      </div>
    </div>
  )
}

