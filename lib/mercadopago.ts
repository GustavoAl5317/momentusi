import { MercadoPagoConfig, Preference } from 'mercadopago'

// ⚠️ SEGURANÇA: Este arquivo é SERVER-SIDE apenas
// MERCADOPAGO_ACCESS_TOKEN NUNCA deve ser usado no client

// Validar que o token existe no servidor
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken) {
  throw new Error(
    'MERCADOPAGO_ACCESS_TOKEN não está configurado. Configure no arquivo .env.local'
  )
}

// Detectar ambiente: pode ser forçado via variável de ambiente ou detectado pelo token
// Variável de ambiente tem prioridade (útil para tokens de teste que começam com APP_USR-)
const forcedEnvironment = process.env.MERCADOPAGO_ENVIRONMENT?.toLowerCase()

let isProduction: boolean
let isSandbox: boolean

if (forcedEnvironment === 'test' || forcedEnvironment === 'sandbox') {
  // Ambiente forçado para TESTE
  isProduction = false
  isSandbox = true
  console.log('⚠️ Ambiente forçado para TESTE via MERCADOPAGO_ENVIRONMENT')
} else if (forcedEnvironment === 'production' || forcedEnvironment === 'prod') {
  // Ambiente forçado para PRODUÇÃO
  isProduction = true
  isSandbox = false
  console.log('⚠️ Ambiente forçado para PRODUÇÃO via MERCADOPAGO_ENVIRONMENT')
} else {
  // Detecção automática pelo token
  // - Token de TESTE (sandbox) começa com "TEST-"
  // - Token de PRODUÇÃO começa com "APP_USR-"
  isProduction = accessToken.startsWith('APP_USR-')
  isSandbox = accessToken.startsWith('TEST-')
  
  if (!isProduction && !isSandbox) {
    throw new Error(
      'MERCADOPAGO_ACCESS_TOKEN inválido. ' +
      'Deve começar com "APP_USR-" (produção) ou "TEST-" (sandbox/teste). ' +
      'Ou defina MERCADOPAGO_ENVIRONMENT=test ou MERCADOPAGO_ENVIRONMENT=production. ' +
      'Obtenha em: https://www.mercadopago.com.br/developers/panel/credentials'
    )
  }
}

// Inicializar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: accessToken,
  options: {
    timeout: 5000,
  },
})

export const mercadoPago = new Preference(client)
export const isMercadoPagoProduction = isProduction

// Função helper para log seguro (mostra apenas prefixo)
export function getTokenPrefix(): string {
  return accessToken.substring(0, 6) + '...'
}

export const PLAN_PRICES = {
  essential: 19.90, // R$19,90
  complete: 39.90, // R$39,90
} as const

export type PlanType = keyof typeof PLAN_PRICES

