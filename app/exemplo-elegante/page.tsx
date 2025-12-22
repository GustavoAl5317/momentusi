import TimelineView from '@/components/TimelineView'
import { TimelineWithMoments } from '@/types'

const timeline: TimelineWithMoments = {
  id: '3',
  slug: 'elegante',
  title: 'Jornada Acadêmica',
  subtitle: 'Maria - Formatura 2023',
  theme: 'elegant',
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
}

export default function ExampleElegantPage() {
  return <TimelineView timeline={timeline} />
}

