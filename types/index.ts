export type PlanType = 'essential' | 'complete'

export type TimelineLayout = 'vertical' | 'horizontal'

export interface Timeline {
  id: string
  slug: string
  title: string
  subtitle?: string
  theme: string
  layout: TimelineLayout
  plan_type: PlanType
  is_published: boolean
  is_private: boolean
  password_hash?: string
  edit_token: string
  final_message?: string
  custom_colors?: {
    primary?: string
    secondary?: string
    background?: string
    text?: string
    card?: string
  } | string // Pode ser string (JSON) ou objeto
  created_at: string
  updated_at: string
}

export interface Moment {
  id: string
  timeline_id: string
  date: string
  title: string
  description: string
  image_url?: string // Mantido para compatibilidade com dados antigos
  image_urls?: string[] // Array de URLs de imagens (até 3)
  music_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  timeline_id: string
  mercado_pago_payment_id: string
  plan_type: PlanType
  amount: number
  status: 'pending' | 'succeeded' | 'failed'
  email?: string
  created_at: string
  updated_at: string
}

export interface TimelineWithMoments extends Timeline {
  moments: Moment[]
}

