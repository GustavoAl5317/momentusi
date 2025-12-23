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
    bg: 'bg-indigo-900',
    border: 'border-2 border-indigo-600',
    accent: 'text-purple-300',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
  romantic: {
    bg: 'bg-rose-800',
    border: 'border-2 border-rose-500',
    accent: 'text-pink-300',
    button: 'bg-pink-600 hover:bg-pink-700',
  },
  elegant: {
    bg: 'bg-slate-700',
    border: 'border-2 border-slate-500',
    accent: 'text-gray-300',
    button: 'bg-gray-700 hover:bg-gray-800',
  },
  vintage: {
    bg: 'bg-amber-800',
    border: 'border-2 border-amber-500',
    accent: 'text-orange-300',
    button: 'bg-orange-600 hover:bg-orange-700',
  },
  modern: {
    bg: 'bg-cyan-900',
    border: 'border-2 border-cyan-500',
    accent: 'text-sky-300',
    button: 'bg-sky-600 hover:bg-sky-700',
  },
}

export default function TimelinePreview({ timeline }: TimelinePreviewProps) {
  const theme = themeStyles[timeline.theme as keyof typeof themeStyles] || themeStyles.default

  return (
    <div
      className={`${theme.bg} rounded-3xl shadow-xl overflow-hidden border-2 ${theme.border} hover:shadow-2xl transition-all hover:scale-105 group`}
    >
      {/* Header do Preview */}
      <div className="p-6 border-b-2 border-pink-500/20">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
          {timeline.title}
        </h3>
        {timeline.subtitle && (
          <p className="text-gray-300 font-medium">{timeline.subtitle}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-xs font-semibold ${theme.accent} bg-slate-700/80 px-3 py-1 rounded-full`}>
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
            className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-pink-500/20 hover:scale-105 transition-transform"
          >
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full bg-pink-500 flex-shrink-0 mt-1`}></div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  {format(new Date(moment.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </div>
                <h4 className="font-semibold text-white mb-1">
                  {moment.title}
                </h4>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {moment.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        {timeline.moments.length > 3 && (
          <div className="text-center text-sm text-gray-400">
            +{timeline.moments.length - 3} momentos
          </div>
        )}
      </div>

      {/* Footer com botão */}
      <div className="p-6 bg-slate-700/30 border-t-2 border-pink-500/20">
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

