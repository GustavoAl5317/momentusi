import TimelineView from '@/components/TimelineView'
import { TimelineWithMoments } from '@/types'

const timeline: TimelineWithMoments = {
  id: '5',
  slug: 'padrao',
  title: 'Momentos Especiais',
  subtitle: 'Família Santos',
  theme: 'default',
  layout: 'vertical',
  plan_type: 'essential',
  is_published: true,
  is_private: false,
  edit_token: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
}

export default function ExampleDefaultPage() {
  return <TimelineView timeline={timeline} />
}

