import TimelineView from '@/components/TimelineView'
import { TimelineWithMoments } from '@/types'

const timeline: TimelineWithMoments = {
  id: '1',
  slug: 'romantico',
  title: 'Nossa História de Amor',
  subtitle: 'Ana e João',
  theme: 'romantic',
  layout: 'vertical',
  plan_type: 'complete',
  is_published: true,
  is_private: false,
  edit_token: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
}

export default function ExampleRomanticPage() {
  return <TimelineView timeline={timeline} />
}

