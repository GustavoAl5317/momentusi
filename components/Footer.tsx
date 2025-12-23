'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

function FooterContent() {
  const pathname = usePathname()
  
  // Rotas conhecidas que devem ter footer
  const knownRoutes = ['/', '/create', '/edit', '/checkout', '/success', '/buscar-links', '/explore', '/termos', '/privacidade', '/aguardando-pagamento', '/publicar-timeline']
  const isTimelinePage = pathname && !knownRoutes.includes(pathname) && !pathname.startsWith('/api')
  
  // Não renderizar footer em páginas públicas de timeline
  if (isTimelinePage) {
    return null
  }
  
  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-pink-500/30 text-gray-300 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Sobre */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">⏱️</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Momenta
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              Transforme seus momentos especiais em uma linha do tempo única e compartilhável.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="mailto:gustavo.developer@hotmail.com"
                className="w-10 h-10 bg-slate-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Email"
              >
                <span className="text-lg">📧</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <span className="text-lg">📷</span>
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/explore" 
                  className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Exemplos</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/create" 
                  className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Criar Timeline</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/#precos" 
                  className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Preços</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:gustavo.developer@hotmail.com"
                  className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Email</div>
                    <div className="text-sm">gustavo.developer@hotmail.com</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                    <span className="text-xl">📷</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Instagram</div>
                    <div className="text-sm">@momenta</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Termos e Copyright */}
        <div className="border-t border-pink-500/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <Link 
                href="/termos" 
                className="text-gray-400 hover:text-pink-400 transition-colors hover:underline"
              >
                Termos de Uso
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/privacidade" 
                className="text-gray-400 hover:text-pink-400 transition-colors hover:underline"
              >
                Política de Privacidade
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Momenta. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Footer() {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  )
}

