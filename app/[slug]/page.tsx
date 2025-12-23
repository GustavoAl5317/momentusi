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
      return { requiresPassword: true, error: 'Senha necessária' }
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

  if (timeline.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Timeline não encontrada
          </h1>
          <p className="text-gray-600">{timeline.error}</p>
        </div>
      </div>
    )
  }

  if (timeline.requiresPassword) {
    return <PasswordPrompt slug={params.slug} />
  }

  return <TimelineViewWrapper timeline={timeline} />
}

function PasswordPrompt({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Página Privada
        </h1>
        <p className="text-gray-600 mb-6">
          Esta linha do tempo é privada. Digite a senha para acessar.
        </p>
        <form
          action={`/${slug}`}
          method="get"
          className="space-y-4"
        >
          <input
            type="password"
            name="password"
            placeholder="Senha"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  )
}

