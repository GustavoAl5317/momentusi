import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export const PLAN_PRICES = {
  essential: 1990, // R$19,90 em centavos
  complete: 3990, // R$39,90 em centavos
} as const

export type PlanType = keyof typeof PLAN_PRICES

