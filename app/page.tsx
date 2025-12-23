import Link from 'next/link'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decoração de fundo animada */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-rose-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo/Ícone visual */}
            <div className="mb-10 flex justify-center animate-fadeInUp">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 w-32 h-32 rounded-3xl flex items-center justify-center text-white text-6xl font-bold shadow-2xl transform group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-0">
                  ⏱️
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Título principal */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 bg-clip-text text-transparent animate-gradient leading-tight">
              Momentusi
            </h1>
            
            {/* Subtítulo */}
            <div className="mb-8 space-y-3">
              <p className="text-3xl md:text-4xl lg:text-5xl text-gray-200 font-light">
                Transforme seus
              </p>
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Momentos Especiais
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl text-gray-200 font-light">
                em uma linha do tempo única
              </p>
            </div>

            {/* Descrição */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Crie, personalize e compartilhe uma página linda com todos os seus momentos importantes. 
              <span className="block mt-2 text-pink-400 font-semibold">
                Um presente digital permanente para sempre guardar suas memórias 💕
              </span>
            </p>

            {/* CTAs principais */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link
                href="/create"
                className="group relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-pink-600 hover:via-rose-600 hover:to-pink-600 transition-all shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transform duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  ✨ Criar Minha Linha do Tempo
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
              <Link
                href="/explore"
                className="group bg-slate-800/90 backdrop-blur-sm text-pink-400 border-2 border-pink-500 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-700 transition-all shadow-xl hover:shadow-2xl hover:scale-110 transform duration-300 flex items-center justify-center gap-3"
              >
                👀 Ver Exemplos
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Preview visual da timeline */}
            <div className="mt-16 mb-20 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-pink-500/30 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
                  <div className="h-2 w-40 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 rounded-full shadow-lg"></div>
                  <div className="w-4 h-4 bg-rose-500 rounded-full animate-pulse"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-4 h-24 flex items-center justify-center border border-pink-500/20">
                      <div className="text-2xl">📸</div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-300 text-center font-medium">
                  Visualize seus momentos em uma linha do tempo elegante e interativa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Features */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Por que escolher o <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Momentusi</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A forma mais bonita e fácil de preservar e compartilhar seus momentos especiais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {[
              {
                icon: '🎨',
                title: 'Design Personalizado',
                description: 'Escolha entre temas lindos e layouts verticais ou horizontais para criar algo único',
              },
              {
                icon: '📸',
                title: 'Múltiplas Fotos',
                description: 'Adicione até 3 fotos por momento para contar sua história completa',
              },
              {
                icon: '🎵',
                title: 'Música e Emoção',
                description: 'Inclua links de Spotify ou YouTube para tornar cada momento ainda mais especial',
              },
              {
                icon: '🔒',
                title: 'Privacidade',
                description: 'Mantenha sua linha do tempo privada com senha ou compartilhe publicamente',
              },
              {
                icon: '📱',
                title: 'QR Code',
                description: 'Gere um QR Code para compartilhar facilmente sua linha do tempo',
              },
              {
                icon: '💝',
                title: 'Presente Perfeito',
                description: 'Crie um presente digital único e permanente para alguém especial',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-500/30 hover:border-pink-500/50 hover:shadow-2xl transition-all hover:scale-105 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Planos - Seção com ID para âncora */}
        <div id="precos" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Escolha seu <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Plano</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Pagamento único. Sem mensalidades. Acesso permanente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Plano Essencial */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-2 border-pink-500/30 hover:border-pink-500/50 transition-all hover:scale-105 hover:shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-50"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold text-white mb-4">
                    Plano Essencial
                  </h3>
                  <div className="text-6xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                    R$ 19,90
                  </div>
                  <p className="text-gray-400 font-medium">Pagamento único</p>
                </div>
                <ul className="space-y-5 mb-10">
                  {[
                    'Até 10 momentos',
                    '1 tema visual',
                    'Página pública permanente',
                    'URL única compartilhável',
                    'Link de edição secreto',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-400 mr-4 text-2xl flex-shrink-0">✓</span>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/create?plan=essential"
                  className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-5 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Escolher Essencial
                </Link>
              </div>
            </div>

            {/* Plano Completo - Destaque */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl p-10 text-white border-4 border-rose-500/50 relative overflow-hidden hover:scale-105 transition-all group">
              {/* Badge Popular */}
              <div className="absolute top-6 right-6 z-20">
                <span className="bg-yellow-400 text-gray-900 text-sm font-black px-4 py-2 rounded-full shadow-2xl animate-bounce">
                  ⭐ MAIS POPULAR
                </span>
              </div>

              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              {/* Conteúdo */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold mb-4">Plano Completo</h3>
                  <div className="text-6xl font-black mb-2">R$ 39,90</div>
                  <p className="text-gray-300 font-medium">Pagamento único</p>
                </div>
                <ul className="space-y-5 mb-10">
                  {[
                    'Momentos ilimitados',
                    'Temas premium exclusivos',
                    'Sem marca do site',
                    'Página privada (senha opcional)',
                    'Modo apresentação',
                    'Carta final personalizada',
                    'QR Code da página',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-yellow-300 mr-4 text-2xl flex-shrink-0">✓</span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/create?plan=complete"
                  className="block w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-5 rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Escolher Completo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Como Usar - Seção com ID para âncora */}
        <div id="como-usar" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Como <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Usar</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Crie sua linha do tempo em poucos passos simples
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Crie sua conta',
                  description: 'Clique em "Criar Minha Linha do Tempo" e comece a criar sua história',
                  icon: '✨',
                },
                {
                  step: '2',
                  title: 'Adicione seus momentos',
                  description: 'Adicione datas, títulos, descrições e até 3 fotos por momento especial',
                  icon: '📸',
                },
                {
                  step: '3',
                  title: 'Personalize o design',
                  description: 'Escolha o tema, layout e cores que melhor representam sua história',
                  icon: '🎨',
                },
                {
                  step: '4',
                  title: 'Compartilhe',
                  description: 'Publique sua timeline e compartilhe o link único com quem você ama',
                  icon: '💕',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-500/30 hover:border-pink-500/50 transition-all flex gap-6 items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perguntas Frequentes - Seção com ID para âncora */}
        <div id="faq" className="container mx-auto px-4 py-20 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Perguntas <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tire suas dúvidas sobre o Momentusi
            </p>
          </div>

          <FAQ
            items={[
              {
                question: 'Como funciona o pagamento?',
                answer: 'O pagamento é único e feito através do Mercado Pago. Após o pagamento, sua timeline fica publicada permanentemente, sem mensalidades ou taxas adicionais.',
              },
              {
                question: 'Posso editar minha timeline depois de publicada?',
                answer: 'Sim! Você recebe um link secreto de edição que permite modificar sua timeline a qualquer momento, adicionar novos momentos ou alterar o design.',
              },
              {
                question: 'Quantas fotos posso adicionar por momento?',
                answer: 'Você pode adicionar até 3 fotos por momento, permitindo contar sua história de forma mais completa e visual.',
              },
              {
                question: 'Minha timeline pode ser privada?',
                answer: 'Sim! No plano Completo, você pode tornar sua timeline privada e adicionar uma senha para proteger o acesso.',
              },
              {
                question: 'Posso compartilhar minha timeline?',
                answer: 'Claro! Cada timeline tem uma URL única que você pode compartilhar. Também é possível gerar um QR Code para facilitar o compartilhamento.',
              },
              {
                question: 'O que acontece se eu não pagar?',
                answer: 'Você pode criar e editar sua timeline gratuitamente. O pagamento é necessário apenas para publicar e tornar sua timeline acessível publicamente.',
              },
            ]}
          />
        </div>

        {/* CTA Final */}
        <div className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para começar?
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-pink-100 max-w-2xl mx-auto">
                Crie sua linha do tempo em minutos e compartilhe seus momentos especiais com quem você ama
              </p>
              <Link
                href="/create"
                className="inline-block bg-white text-pink-600 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-110 transform"
              >
                ✨ Criar Agora - É Grátis Começar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
