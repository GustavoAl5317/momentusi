import Link from 'next/link'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-500/30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 mb-8 transition-colors"
          >
            ← Voltar
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Informações Coletadas</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como conteúdo das timelines, informações de pagamento processadas pelo Mercado Pago, e dados de uso do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Uso das Informações</h2>
              <p>
                Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, processar pagamentos e comunicar-nos com você.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Compartilhamento</h2>
              <p>
                Não vendemos suas informações pessoais. Compartilhamos informações apenas com provedores de serviços necessários (como Mercado Pago para processamento de pagamentos) e quando exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Segurança</h2>
              <p>
                Implementamos medidas de segurança para proteger suas informações, mas nenhum método de transmissão pela internet é 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento através do link de edição de sua timeline.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contato</h2>
              <p>
                Para questões sobre privacidade, entre em contato através do email: <a href="mailto:gsantana.dev@hotmail.com" className="text-pink-400 hover:underline">gsantana.dev@hotmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

