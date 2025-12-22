import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ⚠️ SEGURANÇA: SUPABASE_SERVICE_ROLE_KEY é SERVER-SIDE apenas
// NUNCA deve ser usado no client ou exposto via NEXT_PUBLIC_*

// Verificar se estamos em build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (isBuildTime ? 'https://placeholder.supabase.co' : '')
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isBuildTime ? 'placeholder-key' : '')
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (isBuildTime ? 'placeholder-service-key' : '')

// Validar que SERVICE_ROLE_KEY existe apenas no servidor (não durante build)
if (typeof window === 'undefined' && !isBuildTime && !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY não está configurado no servidor. Configure no arquivo .env.local'
  )
}

// Validar formato da URL do Supabase
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

if (!supabaseServiceKey) {
  console.error('⚠️ SUPABASE_SERVICE_ROLE_KEY não configurada!')
  console.error('Encontre em: Supabase Dashboard > Settings > API > service_role (secret)')
}

// Lazy initialization para evitar erros durante build
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!_supabaseAdmin) {
    // Durante build, usar uma chave placeholder
    const serviceKey = isBuildTime && !supabaseServiceKey 
      ? 'placeholder-service-key' 
      : (supabaseServiceKey || '')
    
    _supabaseAdmin = createClient(supabaseUrl, serviceKey)
  }
  return _supabaseAdmin
}

export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseAdminClient()

