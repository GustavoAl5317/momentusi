'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, Suspense } from 'react'

function HeaderContent() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Rotas conhecidas que devem ter header
  const knownRoutes = ['/', '/create', '/edit', '/checkout', '/success', '/buscar-links', '/explore', '/termos', '/privacidade', '/aguardando-pagamento', '/publicar-timeline']
  const isTimelinePage = pathname && !knownRoutes.includes(pathname) && !pathname.startsWith('/api')
  
  // Não renderizar header em páginas públicas de timeline
  if (isTimelinePage) {
    return null
  }

  const navItems = [
    { href: '/', label: 'Início' },
    { href: '/#precos', label: 'Preços' },
    { href: '/explore', label: 'Exemplos' },
    { href: '/#como-usar', label: 'Como Usar' },
    { href: '/#faq', label: 'Perguntas Frequentes' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-pink-500/30 shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">⏱️</div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Momenta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-pink-400 bg-pink-500/10'
                    : 'text-gray-300 hover:text-pink-400 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/create"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-500/50"
            >
              Criar Timeline
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-pink-400 p-2"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-500/30">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-pink-400 bg-pink-500/10'
                      : 'text-gray-300 hover:text-pink-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/create"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg text-center mt-2"
              >
                Criar Timeline
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-pink-500/30 shadow-lg">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl">⏱️</div>
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Momenta
              </span>
            </Link>
          </div>
        </nav>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  )
}

