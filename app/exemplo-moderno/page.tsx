import TimelineView from '@/components/TimelineView'
import { TimelineWithMoments } from '@/types'

const timeline: TimelineWithMoments = {
  id: '2',
  slug: 'moderno',
  title: 'Viagem pela Europa',
  subtitle: 'Família Silva',
  theme: 'modern',
  layout: 'horizontal',
  plan_type: 'complete',
  is_published: true,
  is_private: false,
  edit_token: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
}

export default function ExampleModernPage() {
  return <TimelineView timeline={timeline} />
}

