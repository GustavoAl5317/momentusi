import { Metadata } from 'next'
import TimelineViewWrapper from '@/components/TimelineViewWrapper'

interface PageProps {
  params: { slug: string }
  searchParams: { password?: string }
}

async function getTimeline(slug: string, password?: string) {
  const url = new URL(`/api/timeline/${slug}`, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  if (password) {
    url.searchParams.set('password', password)
  }

  const res = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!res.ok) {
    if (res.status === 403) {
      // Tentar parsear o JSON para pegar a mensagem de erro
      try {
        const errorData = await res.json()
        return { 
          requiresPassword: true, 
          error: errorData.error || 'Senha necessária' 
        }
      } catch {
        return { requiresPassword: true, error: 'Senha necessária' }
      }
    }
    return { error: 'Timeline não encontrada' }
  }

  return res.json()
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const timeline = await getTimeline(params.slug)

  if (timeline.error) {
    return {
      title: 'Timeline não encontrada - Momentusi',
    }
  }

  return {
    title: `${timeline.title} - Momentusi`,
    description: timeline.subtitle || timeline.title,
    openGraph: {
      title: timeline.title,
      description: timeline.subtitle || timeline.title,
      type: 'website',
    },
  }
}

export default async function TimelinePage({
  params,
  searchParams,
}: PageProps) {
  const timeline = await getTimeline(params.slug, searchParams.password)

  // Verificar se precisa de senha PRIMEIRO (antes de verificar erro)
  if (timeline.requiresPassword) {
    return <PasswordPrompt slug={params.slug} error={timeline.error} />
  }

  // Se tiver erro e não for requiresPassword, mostrar erro
  if (timeline.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Timeline não encontrada
          </h1>
          <p className="text-gray-400">{timeline.error}</p>
        </div>
      </div>
    )
  }

  return <TimelineViewWrapper timeline={timeline} />
}

function PasswordPrompt({ slug, error }: { slug: string; error?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8 border-2 border-pink-500/30">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Página Privada
          </h1>
          <p className="text-gray-400">
            Esta linha do tempo é privada. Digite a senha para acessar.
          </p>
        </div>
        {error && error !== 'Senha necessária' && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <form
          action={`/${slug}`}
          method="get"
          className="space-y-4"
        >
          <input
            type="password"
            name="password"
            placeholder="Digite a senha"
            required
            autoFocus
            className="w-full px-4 py-3 bg-slate-700 text-white border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-pink-500/50"
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  )
}

