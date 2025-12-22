# Configuração de Variáveis de Ambiente no Vercel

Este documento explica como configurar as variáveis de ambiente necessárias no Vercel para que a aplicação funcione corretamente.

## ⚠️ Variáveis Obrigatórias - TODAS DEVEM SER CONFIGURADAS

**IMPORTANTE**: Todas as variáveis abaixo são **OBRIGATÓRIAS** para o funcionamento da aplicação. Se alguma estiver faltando, você receberá erros em runtime.

### 1. Variáveis do Supabase (TODAS OBRIGATÓRIAS)

#### `NEXT_PUBLIC_SUPABASE_URL` ⚠️ OBRIGATÓRIA
- **Onde encontrar**: Supabase Dashboard > Settings > API > Project URL
- **Formato**: `https://[seu-project-id].supabase.co`
- **Exemplo**: `https://abcdefghijklmnop.supabase.co`
- **Erro se faltar**: "supabaseUrl is required" ou "NEXT_PUBLIC_SUPABASE_URL não está configurado"

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⚠️ OBRIGATÓRIA
- **Onde encontrar**: Supabase Dashboard > Settings > API > Project API keys > `anon` `public`
- **Formato**: Chave longa começando com `eyJ...`
- **Importante**: Esta é a chave pública (anon), não a service_role
- **Erro se faltar**: "NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurado"

#### `SUPABASE_SERVICE_ROLE_KEY` ⚠️ OBRIGATÓRIA
- **Onde encontrar**: Supabase Dashboard > Settings > API > Project API keys > `service_role` `secret`
- **Formato**: Chave longa começando com `eyJ...`
- **⚠️ CRÍTICO**: Esta é a chave secreta (service_role). NUNCA exponha no cliente!
- **Importante**: Esta variável NÃO deve ter o prefixo `NEXT_PUBLIC_` porque é server-side only
- **Erro se faltar**: "SUPABASE_SERVICE_ROLE_KEY não está configurado no servidor"

### 2. Variáveis do Mercado Pago

#### `MERCADOPAGO_ACCESS_TOKEN` ⚠️ OBRIGATÓRIA
- **Onde encontrar**: https://www.mercadopago.com.br/developers/panel/credentials
- **Formato**: 
  - Teste/Sandbox: Começa com `TEST-`
  - Produção: Começa com `APP_USR-`
- **Exemplo (teste)**: `TEST-12345678901234567890123456789012`
- **Erro se faltar**: "MERCADOPAGO_ACCESS_TOKEN não está configurado"

#### `MERCADOPAGO_ENVIRONMENT` (Opcional)
- **Valores**: `test`, `sandbox`, `production`, ou `prod`
- **Padrão**: Detectado automaticamente pelo prefixo do token
- **Uso**: Use apenas se quiser forçar um ambiente específico

### 3. Variáveis da Aplicação

#### `NEXT_PUBLIC_SITE_URL` ⚠️ OBRIGATÓRIA (para checkout)
- **O que é**: URL base do seu site (usada para URLs de retorno do Mercado Pago)
- **Formato**: 
  - Desenvolvimento: `http://localhost:3000`
  - Produção: `https://momentusi.vercel.app` (ou seu domínio customizado)
- **Exemplo (produção)**: `https://momentusi.vercel.app`
- **Exemplo (desenvolvimento)**: `http://localhost:3000`
- **Erro se faltar ou inválida**: "NEXT_PUBLIC_SITE_URL deve ser uma URL válida"
- **Nota**: Se não estiver definida, o sistema tentará detectar automaticamente do request, mas é recomendado configurá-la explicitamente

## Como Configurar no Vercel

### Passo a Passo:

1. **Acesse o Dashboard do Vercel**
   - Vá para https://vercel.com/dashboard
   - Faça login na sua conta

2. **Selecione seu Projeto**
   - Clique no projeto `momentusi` (ou o nome do seu projeto)

3. **Acesse as Configurações**
   - Clique em **Settings** no menu superior
   - No menu lateral, clique em **Environment Variables**

4. **Adicione cada variável (TODAS SÃO OBRIGATÓRIAS)**
   - Clique em **Add New**
   - Digite o **Name** (nome da variável, exatamente como mostrado acima)
   - Digite o **Value** (valor da variável)
   - Selecione os **Environments** onde a variável será usada:
     - ✅ **Production** (obrigatório)
     - ✅ **Preview** (recomendado)
     - ✅ **Development** (opcional, apenas se usar Vercel CLI localmente)
   - Clique em **Save**

5. **Repita para TODAS as variáveis obrigatórias**
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ✅ `MERCADOPAGO_ACCESS_TOKEN`
   - ✅ `NEXT_PUBLIC_SITE_URL` (obrigatória para checkout funcionar)
   - ⚠️ **IMPORTANTE**: Se qualquer uma dessas variáveis estiver faltando, a aplicação não funcionará!

6. **Faça um novo Deploy**
   - Após adicionar todas as variáveis, você precisa fazer um novo deploy
   - Vá para a aba **Deployments**
   - Clique nos três pontos (...) do último deploy
   - Selecione **Redeploy**
   - Ou faça um novo commit e push para o repositório

## Verificação

Após configurar as variáveis e fazer o deploy, você pode verificar se estão funcionando:

1. **Verifique os logs do Vercel**
   - Vá em **Deployments** > Selecione o deploy > **Functions** > Clique em uma função
   - Os logs não devem mostrar erros sobre variáveis não configuradas

2. **Teste a aplicação**
   - Tente criar uma timeline
   - Tente fazer upload de uma imagem
   - Se funcionar, as variáveis estão configuradas corretamente

## Troubleshooting

### Erro: "supabaseUrl is required" ou "NEXT_PUBLIC_SUPABASE_URL não está configurado"
- ✅ **CAUSA**: A variável `NEXT_PUBLIC_SUPABASE_URL` não está configurada no Vercel
- ✅ **SOLUÇÃO**: 
  1. Vá em Vercel Dashboard > Settings > Environment Variables
  2. Adicione `NEXT_PUBLIC_SUPABASE_URL` com o valor da URL do seu projeto Supabase
  3. Encontre a URL em: Supabase Dashboard > Settings > API > Project URL
  4. Faça um novo deploy após adicionar

### Erro: "SUPABASE_SERVICE_ROLE_KEY não está configurado"
- ✅ **CAUSA**: A variável `SUPABASE_SERVICE_ROLE_KEY` não está configurada no Vercel
- ✅ **SOLUÇÃO**: 
  1. Verifique se a variável foi adicionada no Vercel
  2. Verifique se o nome está exatamente correto: `SUPABASE_SERVICE_ROLE_KEY` (sem `NEXT_PUBLIC_`)
  3. Verifique se selecionou os environments corretos (Production e Preview)
  4. Faça um novo deploy após adicionar a variável

### Erro: "NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurado"
- ✅ **CAUSA**: A variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` não está configurada no Vercel
- ✅ **SOLUÇÃO**: 
  1. Vá em Vercel Dashboard > Settings > Environment Variables
  2. Adicione `NEXT_PUBLIC_SUPABASE_ANON_KEY` com o valor da chave anon do Supabase
  3. Encontre a chave em: Supabase Dashboard > Settings > API > Project API keys > anon public
  4. Faça um novo deploy após adicionar

### Erro: "MERCADOPAGO_ACCESS_TOKEN não está configurado"
- ✅ **CAUSA**: A variável `MERCADOPAGO_ACCESS_TOKEN` não está configurada no Vercel
- ✅ **SOLUÇÃO**: 
  1. Verifique se a variável foi adicionada no Vercel
  2. Verifique se o token está correto (copie e cole diretamente do dashboard do Mercado Pago)
  3. Verifique se não há espaços extras no início ou fim do valor
  4. Faça um novo deploy após adicionar

### Erro: "NEXT_PUBLIC_SITE_URL deve ser uma URL válida"
- ✅ **CAUSA**: A variável `NEXT_PUBLIC_SITE_URL` não está configurada ou está com valor inválido
- ✅ **SOLUÇÃO**: 
  1. Vá em Vercel Dashboard > Settings > Environment Variables
  2. Adicione `NEXT_PUBLIC_SITE_URL` com o valor:
     - **Produção**: `https://momentusi.vercel.app` (ou seu domínio customizado)
     - **Preview**: Use a URL do preview do Vercel (ex: `https://seu-projeto-git-branch.vercel.app`)
  3. Certifique-se de que a URL começa com `http://` ou `https://`
  4. Não adicione barra no final (ex: use `https://seusite.com` e não `https://seusite.com/`)
  5. Faça um novo deploy após adicionar

### Variáveis não estão sendo carregadas
- ✅ Certifique-se de que fez um novo deploy após adicionar as variáveis
- ✅ Verifique se o nome da variável está exatamente correto (case-sensitive)
- ✅ Verifique se selecionou os environments corretos (Production e Preview)
- ✅ **IMPORTANTE**: Variáveis adicionadas após o deploy não são aplicadas automaticamente. Você DEVE fazer um novo deploy!

## Segurança

⚠️ **IMPORTANTE**: 
- `SUPABASE_SERVICE_ROLE_KEY` e `MERCADOPAGO_ACCESS_TOKEN` são **SECRETAS**
- NUNCA as exponha no código do cliente
- NUNCA as commite no Git
- NUNCA as adicione com o prefixo `NEXT_PUBLIC_`
- Use apenas no servidor (API Routes, Server Components, etc.)

## Variáveis Locais (Desenvolvimento)

Para desenvolvimento local, crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
MERCADOPAGO_ACCESS_TOKEN=TEST-seu-token-aqui
MERCADOPAGO_ENVIRONMENT=test
```

⚠️ **NUNCA** commite o arquivo `.env.local` no Git! Ele já está no `.gitignore`.

