# 🔧 Correção: URL do Supabase Incorreta

## ❌ Problema Identificado

O erro mostra que a resposta do Supabase está retornando **HTML** (página do dashboard) em vez de **JSON** (resposta da API). Isso significa que a `NEXT_PUBLIC_SUPABASE_URL` está configurada incorretamente.

## ✅ Solução

### Passo 1: Encontrar a URL Correta

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** (⚙️) no menu lateral
4. Clique em **API**
5. Na seção **Project URL**, copie a URL que deve ser algo como:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   **NÃO copie** a URL do dashboard (`https://app.supabase.com`)

### Passo 2: Atualizar o `.env.local`

Abra o arquivo `.env.local` na raiz do projeto e verifique/atualize:

```env
# ✅ CORRETO - deve terminar com .supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# ❌ INCORRETO - não use estas URLs
# NEXT_PUBLIC_SUPABASE_URL=https://app.supabase.com
# NEXT_PUBLIC_SUPABASE_URL=https://supabase.com
```

### Passo 3: Verificar Todas as Variáveis

Certifique-se de que todas as variáveis estão configuradas:

```env
# URL do projeto (encontre em Settings > API > Project URL)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Anon Key (encontre em Settings > API > anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (encontre em Settings > API > service_role secret)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Passo 4: Reiniciar o Servidor

Após atualizar o `.env.local`:

1. Pare o servidor Next.js (Ctrl+C)
2. Inicie novamente:
   ```bash
   npm run dev
   ```

### Passo 5: Testar Novamente

Tente criar uma timeline novamente. O erro deve desaparecer.

## 🔍 Como Verificar se Está Correto

A URL correta:
- ✅ Termina com `.supabase.co`
- ✅ Não contém `app.supabase.com`
- ✅ Tem o formato: `https://[project-id].supabase.co`

## 📝 Exemplo de URLs

```
✅ CORRETO:
https://abcdefghijklmnop.supabase.co

❌ INCORRETO:
https://app.supabase.com
https://supabase.com
https://app.supabase.com/project/xxxxx
```

