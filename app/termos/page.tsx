import Link from 'next/link'

export default function TermosPage() {
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
            Termos de Uso
          </h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Momentusi, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Uso do Serviço</h2>
              <p>
                O Momentusi permite que você crie e compartilhe linhas do tempo de momentos especiais. Você é responsável por todo o conteúdo que criar e compartilhar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Pagamento</h2>
              <p>
                Os planos são pagos através do Mercado Pago. O pagamento é único e não há mensalidades. Após o pagamento, sua timeline fica publicada permanentemente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Propriedade Intelectual</h2>
              <p>
                Você mantém todos os direitos sobre o conteúdo que criar. Ao usar o Momentusi, você nos concede uma licença para exibir e hospedar seu conteúdo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitação de Responsabilidade</h2>
              <p>
                O Momentusi não se responsabiliza por perda de dados ou conteúdo. Recomendamos manter backups de suas informações importantes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contato</h2>
              <p>
                Para questões sobre estes termos, entre em contato através do email: <a href="mailto:gustavo.developer@hotmail.com" className="text-pink-400 hover:underline">gustavo.developer@hotmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

