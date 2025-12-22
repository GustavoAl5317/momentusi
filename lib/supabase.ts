import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ⚠️ SEGURANÇA: SUPABASE_SERVICE_ROLE_KEY é SERVER-SIDE apenas
// NUNCA deve ser usado no client ou exposto via NEXT_PUBLIC_*

// Verificar se estamos em build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || (isBuildTime ? 'https://placeholder.supabase.co' : '')
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isBuildTime ? 'placeholder-key' : '')
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key && !isBuildTime && typeof window === 'undefined') {
    const errorMessage = [
      'SUPABASE_SERVICE_ROLE_KEY não está configurado no servidor.',
      '',
      'Para configurar no Vercel:',
      '1. Acesse seu projeto no Vercel Dashboard',
      '2. Vá em Settings > Environment Variables',
      '3. Adicione: SUPABASE_SERVICE_ROLE_KEY = [sua-chave]',
      '4. Encontre a chave em: Supabase Dashboard > Settings > API > service_role (secret)',
      '5. Faça um novo deploy após adicionar a variável',
      '',
      'Para desenvolvimento local, adicione no arquivo .env.local:',
      'SUPABASE_SERVICE_ROLE_KEY=[sua-chave]'
    ].join('\n')
    throw new Error(errorMessage)
  }
  return key || (isBuildTime ? 'placeholder-service-key' : '')
}

// Validar formato da URL do Supabase (apenas em runtime, não durante build)
function validateSupabaseConfig() {
  if (isBuildTime) return
  
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()
  
  if (supabaseUrl) {
    // A URL deve ser algo como: https://xxxxx.supabase.co
    // NÃO deve ser: https://app.supabase.com ou https://supabase.com
    if (supabaseUrl.includes('app.supabase.com') || supabaseUrl.includes('supabase.com') && !supabaseUrl.includes('.supabase.co')) {
      console.error('❌ ERRO: NEXT_PUBLIC_SUPABASE_URL está incorreta!')
      console.error('A URL deve ser: https://[seu-project-id].supabase.co')
      console.error('URL atual:', supabaseUrl)
      console.error('Encontre a URL correta em: Supabase Dashboard > Settings > API > Project URL')
    }
    
    // Verificar se termina com .supabase.co
    if (!supabaseUrl.includes('.supabase.co')) {
      console.error('❌ ERRO: NEXT_PUBLIC_SUPABASE_URL não parece ser uma URL válida do Supabase!')
      console.error('URL atual:', supabaseUrl)
    }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Variáveis do Supabase não configuradas!')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'NÃO DEFINIDA')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'DEFINIDA' : 'NÃO DEFINIDA')
  }
  
  try {
    const serviceKey = getSupabaseServiceKey()
    if (!serviceKey || serviceKey === 'placeholder-service-key') {
      console.error('⚠️ SUPABASE_SERVICE_ROLE_KEY não configurada!')
      console.error('Encontre em: Supabase Dashboard > Settings > API > service_role (secret)')
    }
  } catch (error) {
    // Erro já será lançado quando necessário
  }
}

// Lazy initialization para evitar erros durante build
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    validateSupabaseConfig()
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    
    // Validar variáveis obrigatórias antes de criar o cliente
    if (!url && !isBuildTime && typeof window === 'undefined') {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL não está configurado no servidor. ' +
        'Configure no Vercel Dashboard > Settings > Environment Variables. ' +
        'Encontre a URL em: Supabase Dashboard > Settings > API > Project URL'
      )
    }
    
    if (!key && !isBuildTime && typeof window === 'undefined') {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurado no servidor. ' +
        'Configure no Vercel Dashboard > Settings > Environment Variables. ' +
        'Encontre a chave em: Supabase Dashboard > Settings > API > Project API keys > anon public'
      )
    }
    
    // Durante build, usar placeholders
    const finalUrl = url || 'https://placeholder.supabase.co'
    const finalKey = key || 'placeholder-key'
    
    _supabase = createClient(finalUrl, finalKey)
  }
  return _supabase
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!_supabaseAdmin) {
    validateSupabaseConfig()
    const url = getSupabaseUrl()
    const serviceKey = getSupabaseServiceKey() // Isso lançará erro se não estiver configurado em runtime
    
    // Validar variáveis obrigatórias antes de criar o cliente
    if (!url && !isBuildTime && typeof window === 'undefined') {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL não está configurado no servidor. ' +
        'Configure no Vercel Dashboard > Settings > Environment Variables. ' +
        'Encontre a URL em: Supabase Dashboard > Settings > API > Project URL'
      )
    }
    
    // Durante build, usar placeholders
    const finalUrl = url || 'https://placeholder.supabase.co'
    const finalServiceKey = serviceKey || 'placeholder-service-key'
    
    _supabaseAdmin = createClient(finalUrl, finalServiceKey)
  }
  return _supabaseAdmin
}

// Exportar getters ao invés de valores diretos para lazy initialization
export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseAdminClient()

