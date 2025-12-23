import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso - Momentusi',
  description: 'Termos e condições de uso da plataforma Momentusi',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              href="/"
              className="inline-block mb-6 text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300"
            >
              Momentusi
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Termos de Uso
            </h1>
            <p className="text-slate-400 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-800">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-8 text-slate-300">
                
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                  <p className="leading-relaxed">
                    Ao acessar e utilizar a nossa plataforma, você concorda em cumprir e ficar vinculado aos seguintes Termos de Uso. Caso não concorde com qualquer parte destes termos, você não deve utilizar a plataforma.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
                  <p className="leading-relaxed">
                    Nossa plataforma permite que os usuários criem uma página personalizada de timelines, focando em momentos da vida do usuário.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">3. Cadastro e Segurança</h2>
                  <p className="leading-relaxed">
                    Para utilizar o serviço, você deve fornecer um endereço de email válido. Não compartilharemos seu email com terceiros.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">4. Privacidade</h2>
                  <p className="leading-relaxed">
                    Respeitamos a sua privacidade. Não utilizamos seus dados para qualquer tipo de processamento ou venda de dados para terceiros. O email cadastrado é utilizado apenas para o envio do link da página personalizada.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">5. Conteúdo do Usuário</h2>
                  <p className="leading-relaxed">
                    Você é responsável pelo conteúdo que insere na plataforma, incluindo fotos, mensagens e informações dos momentos. Não nos responsabilizamos por qualquer conteúdo impróprio ou ilegal carregado pelos usuários.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">6. Pagamentos e Reembolsos</h2>
                  <p className="leading-relaxed">
                    Todos os pagamentos são processados através do Mercado Pago. Após a conclusão do pagamento, o usuário receberá um link para a página personalizada via email. Não oferecemos reembolsos, exceto em casos excepcionais a nosso exclusivo critério.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">7. Modificações no Serviço</h2>
                  <p className="leading-relaxed">
                    Nós nos comprometemos a manter o serviço ativo e disponível pelo período contratado, conforme o plano escolhido (tempo vitalício no plano avançado). No entanto, em circunstâncias excepcionais que fujam ao nosso controle, como questões legais, técnicas ou financeiras, reservamo-nos o direito de modificar ou descontinuar o serviço. Caso seja necessário descontinuar o serviço, tomaremos todas as medidas possíveis para notificar os usuários com antecedência e garantir a preservação das páginas ou oferecer soluções alternativas sempre que possível. A Momentusi não se responsabiliza por eventuais perdas decorrentes de modificações ou descontinuação em situações extraordinárias, mas faremos o possível para minimizar o impacto.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">8. Limitação de Responsabilidade</h2>
                  <p className="leading-relaxed">
                    Em nenhuma circunstância seremos responsáveis por qualquer dano indireto, incidental, especial ou consequente decorrente de ou relacionado ao uso ou incapacidade de uso da plataforma.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">9. Alterações nos Termos</h2>
                  <p className="leading-relaxed">
                    Podemos atualizar estes Termos de Uso periodicamente. Quando fizermos isso, revisaremos a data da &quot;última atualização&quot; no topo desta página. É sua responsabilidade revisar estes Termos de Uso periodicamente para se manter informado sobre quaisquer alterações.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">10. Contato</h2>
                  <p className="leading-relaxed">
                    Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco pelo email:{' '}
                    <a 
                      href="mailto:gsantana.dev@hotmail.com" 
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      gsantana.dev@hotmail.com
                    </a>
                  </p>
                </section>

              </div>
            </div>

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <Link
                href="/"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Voltar para a página inicial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
