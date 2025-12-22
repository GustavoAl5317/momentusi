'use client'

import { useState } from 'react'
import Link from 'next/link'
import TimelinePreview from '@/components/TimelinePreview'

const exampleTimelines = [
  {
    id: '1',
    slug: 'romantico',
    title: 'Nossa História de Amor',
    subtitle: 'Ana e João',
    theme: 'romantic',
    layout: 'vertical',
    plan_type: 'complete',
    is_published: true,
    moments: [
      {
        id: '1',
        timeline_id: '1',
        date: '2020-03-14',
        title: 'Nosso Primeiro Encontro',
        description: 'Foi amor à primeira vista no café da esquina. Você estava lendo um livro e eu não consegui tirar os olhos de você. Quando você olhou para mim, soube que algo especial estava começando.',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        timeline_id: '1',
        date: '2020-06-20',
        title: 'Primeiro Beijo',
        description: 'Sob as estrelas, na praia. O momento perfeito que sempre sonhei. O mundo parou e só existíamos nós dois naquele instante mágico.',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        timeline_id: '1',
        date: '2021-02-14',
        title: 'Pedido de Namoro',
        description: 'O dia mais especial da nossa vida. Preparei tudo com tanto carinho e quando você disse sim, meu coração explodiu de felicidade. Começava nossa jornada juntos.',
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        timeline_id: '1',
        date: '2022-08-15',
        title: 'Nossa Primeira Viagem',
        description: 'Fomos para a praia e foi incrível! Cada momento ao seu lado é uma aventura. Descobrimos novos lugares e criamos memórias que vou guardar para sempre.',
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        timeline_id: '1',
        date: '2023-12-25',
        title: 'Natal Juntos',
        description: 'Nosso primeiro Natal como casal. A casa cheia de amor, risos e a certeza de que escolhi a pessoa certa para passar o resto da vida.',
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    final_message: 'Cada dia ao seu lado é um presente. Obrigado por ser minha pessoa favorita. Te amo infinitamente! 💕',
  },
  {
    id: '2',
    slug: 'moderno',
    title: 'Viagem pela Europa',
    subtitle: 'Família Silva',
    theme: 'modern',
    layout: 'horizontal',
    plan_type: 'complete',
    is_published: true,
    moments: [
      {
        id: '1',
        timeline_id: '2',
        date: '2023-07-01',
        title: 'Chegada em Paris',
        description: 'Primeiro dia na cidade luz! A emoção de finalmente estar aqui era indescritível. Caminhamos pelas ruas charmosas, comemos croissants e nos apaixonamos pela cidade.',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        timeline_id: '2',
        date: '2023-07-05',
        title: 'Torre Eiffel',
        description: 'Vista incrível do topo! Subimos até o último andar e a vista de Paris nos deixou sem palavras. Fizemos centenas de fotos e criamos uma memória inesquecível.',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        timeline_id: '2',
        date: '2023-07-10',
        title: 'Roma, Itália',
        description: 'Coliseu e história em cada esquina. Andar pelas ruas de Roma foi como voltar no tempo. Cada monumento contava uma história milenar.',
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        timeline_id: '2',
        date: '2023-07-15',
        title: 'Veneza',
        description: 'Navegar pelos canais de Veneza foi mágico! Os gondoleiros cantando, a arquitetura única e os momentos românticos que vivemos aqui.',
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        timeline_id: '2',
        date: '2023-07-20',
        title: 'Barcelona',
        description: 'Última parada da nossa viagem! A Sagrada Família nos impressionou e as praias de Barcelona foram o fechamento perfeito para essa aventura incrível.',
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    final_message: 'Uma viagem que mudou nossa perspectiva do mundo. Juntos descobrimos lugares incríveis e criamos memórias que durarão para sempre! 🌍',
  },
  {
    id: '3',
    slug: 'elegante',
    title: 'Jornada Acadêmica',
    subtitle: 'Maria - Formatura 2023',
    theme: 'elegant',
    layout: 'vertical',
    plan_type: 'complete',
    is_published: true,
    moments: [
      {
        id: '1',
        timeline_id: '3',
        date: '2019-02-01',
        title: 'Primeiro Dia de Aula',
        description: 'Início de uma nova jornada. O nervosismo e a empolgação se misturavam. Não sabia que aqueles corredores se tornariam minha segunda casa pelos próximos anos.',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        timeline_id: '3',
        date: '2020-03-15',
        title: 'Primeira Nota 10',
        description: 'Consegui minha primeira nota máxima! O esforço valeu a pena e isso me motivou a continuar sempre dando o meu melhor em cada disciplina.',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        timeline_id: '3',
        date: '2021-08-15',
        title: 'Primeiro Estágio',
        description: 'Experiência profissional incrível! Aplicar na prática tudo que aprendi foi transformador. Conheci profissionais incríveis que se tornaram mentores.',
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        timeline_id: '3',
        date: '2022-11-20',
        title: 'TCC Aprovado',
        description: 'Apresentei meu Trabalho de Conclusão de Curso e foi aprovado com louvor! Anos de pesquisa e dedicação resultaram em um trabalho do qual me orgulho muito.',
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        timeline_id: '3',
        date: '2023-12-15',
        title: 'Formatura',
        description: 'Conquista realizada! O dia mais esperado finalmente chegou. Ver minha família orgulhosa na plateia foi emocionante. Uma jornada que valeu cada esforço.',
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    final_message: 'Esta jornada acadêmica me transformou. Aprendi muito mais que teorias - aprendi sobre persistência, dedicação e sobre mim mesma. Obrigada a todos que fizeram parte dessa história! 🎓',
  },
  {
    id: '4',
    slug: 'vintage',
    title: '50 Anos de Casamento',
    subtitle: 'Vovô e Vovó',
    theme: 'vintage',
    layout: 'horizontal',
    plan_type: 'complete',
    is_published: true,
    moments: [
      {
        id: '1',
        timeline_id: '4',
        date: '1973-05-20',
        title: 'Casamento',
        description: 'O dia que tudo começou. Nos casamos em uma cerimônia simples mas cheia de amor. Prometemos ficar juntos na saúde e na doença, e cumprimos essa promessa todos os dias.',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        timeline_id: '4',
        date: '1980-03-15',
        title: 'Nascimento do Primeiro Filho',
        description: 'Nascimento do nosso primeiro amor. Ver você segurando nosso bebê pela primeira vez foi o momento mais lindo da minha vida. Nosso pequeno milagre.',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        timeline_id: '4',
        date: '1995-08-10',
        title: 'Bodas de Prata',
        description: '25 anos juntos! Comemoramos com toda a família. Nossos filhos já estavam crescidos e foi lindo ver como nossa família havia se expandido com tanto amor.',
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        timeline_id: '4',
        date: '2010-12-25',
        title: 'Primeiro Neto',
        description: 'Nosso primeiro neto chegou! Ver você como avô foi emocionante. Você é o melhor avô do mundo e nosso neto tem muita sorte de ter você.',
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        timeline_id: '4',
        date: '2023-05-20',
        title: 'Bodas de Ouro',
        description: '50 anos de felicidade juntos! Meio século de amor, risos, desafios superados e momentos inesquecíveis. Você ainda é a pessoa mais importante da minha vida.',
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    final_message: '50 anos se passaram, mas meu amor por você só cresceu. Obrigada por cada dia, cada riso, cada abraço. Você é meu melhor amigo, meu companheiro e meu grande amor. Aqui está para mais 50 anos! 💕',
  },
  {
    id: '5',
    slug: 'padrao',
    title: 'Momentos Especiais',
    subtitle: 'Família Santos',
    theme: 'default',
    layout: 'vertical',
    plan_type: 'essential',
    is_published: true,
    moments: [
      {
        id: '1',
        timeline_id: '5',
        date: '2022-01-15',
        title: 'Aniversário de 10 Anos',
        description: 'Celebramos uma década de casamento com uma festa linda! Família e amigos se reuniram para comemorar conosco esse marco tão especial.',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        timeline_id: '5',
        date: '2022-06-20',
        title: 'Férias em Família',
        description: 'Nossas primeiras férias todos juntos! Foi incrível ver as crianças se divertindo tanto. Criamos memórias que vamos guardar para sempre.',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        timeline_id: '5',
        date: '2023-03-10',
        title: 'Formatura da Filha',
        description: 'Nossa filha se formou! Ver ela realizando seus sonhos nos enche de orgulho. Ela cresceu tão rápido e se tornou uma mulher incrível.',
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        timeline_id: '5',
        date: '2023-09-05',
        title: 'Nova Casa',
        description: 'Mudamos para nossa casa dos sonhos! Cada canto foi pensado com carinho e agora temos um lar perfeito para criar ainda mais memórias.',
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        timeline_id: '5',
        date: '2023-12-31',
        title: 'Réveillon em Família',
        description: 'Fechamos o ano com chave de ouro! Todos juntos, celebrando as conquistas do ano e planejando um novo ano cheio de esperanças e sonhos.',
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
]

export default function ExplorePage() {
  const [selectedTheme, setSelectedTheme] = useState<string>('all')

  const themes = [
    { id: 'all', name: 'Todos', icon: '🎨' },
    { id: 'default', name: 'Padrão', icon: '✨' },
    { id: 'romantic', name: 'Romântico', icon: '💕' },
    { id: 'elegant', name: 'Elegante', icon: '👔' },
    { id: 'vintage', name: 'Vintage', icon: '📷' },
    { id: 'modern', name: 'Moderno', icon: '🚀' },
  ]

  const filteredTimelines =
    selectedTheme === 'all'
      ? exampleTimelines
      : exampleTimelines.filter((t) => t.theme === selectedTheme)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Explore Exemplos
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Veja como outras pessoas estão criando suas linhas do tempo
          </p>

          {/* Filtros de Tema */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedTheme === theme.id
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:scale-105'
                }`}
              >
                <span className="mr-2">{theme.icon}</span>
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Exemplos */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredTimelines.map((timeline, index) => (
            <div
              key={timeline.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TimelinePreview timeline={timeline} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border-2 border-pink-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para criar a sua?
            </h2>
            <p className="text-gray-600 mb-8">
              Transforme seus momentos especiais em uma linha do tempo única
            </p>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              ✨ Criar Minha Linha do Tempo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

