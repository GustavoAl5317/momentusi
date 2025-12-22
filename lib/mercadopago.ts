import { MercadoPagoConfig, Preference } from 'mercadopago'

// ⚠️ SEGURANÇA: Este arquivo é SERVER-SIDE apenas
// MERCADOPAGO_ACCESS_TOKEN NUNCA deve ser usado no client

// Verificar se estamos em build time (Next.js define NEXT_PHASE durante build)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

// Função para obter o access token (lazy evaluation)
// Não valida durante build time para evitar erros de compilação
function getAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) {
    // Durante build, retorna um valor placeholder válido
    if (isBuildTime) {
      return 'TEST-12345678901234567890123456789012'
    }
    // Só lança erro em runtime, não durante build
    throw new Error(
      'MERCADOPAGO_ACCESS_TOKEN não está configurado. Configure no arquivo .env.local'
    )
  }
  return token
}

// Função para detectar ambiente
function detectEnvironment(): { isProduction: boolean; isSandbox: boolean } {
  const accessToken = getAccessToken()
  const forcedEnvironment = process.env.MERCADOPAGO_ENVIRONMENT?.toLowerCase()

  if (forcedEnvironment === 'test' || forcedEnvironment === 'sandbox') {
    return { isProduction: false, isSandbox: true }
  } else if (forcedEnvironment === 'production' || forcedEnvironment === 'prod') {
    return { isProduction: true, isSandbox: false }
  } else {
    // Detecção automática pelo token
    const isProduction = accessToken.startsWith('APP_USR-')
    const isSandbox = accessToken.startsWith('TEST-')
    
    // Durante build, sempre retornar sandbox para evitar erros
    if (isBuildTime) {
      return { isProduction: false, isSandbox: true }
    }
    
    if (!isProduction && !isSandbox) {
      throw new Error(
        'MERCADOPAGO_ACCESS_TOKEN inválido. ' +
        'Deve começar com "APP_USR-" (produção) ou "TEST-" (sandbox/teste). ' +
        'Ou defina MERCADOPAGO_ENVIRONMENT=test ou MERCADOPAGO_ENVIRONMENT=production. ' +
        'Obtenha em: https://www.mercadopago.com.br/developers/panel/credentials'
      )
    }
    
    return { isProduction, isSandbox }
  }
}

// Lazy initialization - só inicializa quando necessário
let _mercadoPago: Preference | null = null
let _isProduction: boolean | null = null

function getMercadoPagoClient(): Preference {
  if (!_mercadoPago) {
    const accessToken = getAccessToken()
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 5000,
      },
    })
    _mercadoPago = new Preference(client)
  }
  return _mercadoPago
}

function getIsProduction(): boolean {
  if (_isProduction === null) {
    const env = detectEnvironment()
    _isProduction = env.isProduction
  }
  return _isProduction
}

// Exportar - inicialização lazy
// Durante build, usa token placeholder para permitir compilação
export const mercadoPago = getMercadoPagoClient()
export const isMercadoPagoProduction = getIsProduction()

// Função helper para log seguro (mostra apenas prefixo)
export function getTokenPrefix(): string {
  try {
    const accessToken = getAccessToken()
    return accessToken.substring(0, 6) + '...'
  } catch {
    return 'N/A'
  }
}

export const PLAN_PRICES = {
  essential: 19.90, // R$19,90
  complete: 39.90, // R$39,90
} as const

export type PlanType = keyof typeof PLAN_PRICES

