import TimelineView from '@/components/TimelineView'
import { TimelineWithMoments } from '@/types'

const timeline: TimelineWithMoments = {
  id: '4',
  slug: 'vintage',
  title: '50 Anos de Casamento',
  subtitle: 'Vovô e Vovó',
  theme: 'vintage',
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
}

export default function ExampleVintagePage() {
  return <TimelineView timeline={timeline} />
}

