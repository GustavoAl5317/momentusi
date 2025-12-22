import { createClient } from '@supabase/supabase-js'

// ⚠️ SEGURANÇA: SUPABASE_SERVICE_ROLE_KEY é SERVER-SIDE apenas
// NUNCA deve ser usado no client ou exposto via NEXT_PUBLIC_*

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validar que SERVICE_ROLE_KEY existe apenas no servidor
if (typeof window === 'undefined' && !supabaseServiceKey) {
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

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações server-side (com service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey!
)

