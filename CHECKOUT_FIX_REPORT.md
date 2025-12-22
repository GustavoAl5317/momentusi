# 🔧 Relatório: Correção do Checkout Mercado Pago

## 📋 Causa Raiz

**O botão "Pagar" fica desabilitado devido a:**
1. **Mistura de ambientes**: Token de produção (`APP_USR-`) sendo usado com `sandbox_init_point` ou vice-versa
2. **notification_url inválida**: URL com `localhost` em ambiente de produção causa validação falha no Mercado Pago
3. **Falta de validação**: Não havia validação adequada de variáveis de ambiente server-side

## ✅ Correções Aplicadas

### 1. Segurança (Chaves)

**Arquivos alterados:**
- `lib/mercadopago.ts`
- `lib/supabase.ts`

**Mudanças:**
- ✅ Adicionada validação obrigatória de `MERCADOPAGO_ACCESS_TOKEN` no servidor
- ✅ Adicionada validação obrigatória de `SUPABASE_SERVICE_ROLE_KEY` no servidor
- ✅ Garantido que essas chaves NUNCA são usadas no client (apenas server-side)
- ✅ Função helper `getTokenPrefix()` para logs seguros (mostra apenas 6 primeiros caracteres)

**Validações:**
- Se `MERCADOPAGO_ACCESS_TOKEN` não existir → Erro lançado no servidor
- Se `SUPABASE_SERVICE_ROLE_KEY` não existir → Erro lançado no servidor
- Tokens nunca são expostos em logs ou client bundle

### 2. Fluxo Identificado

**Tipo:** Checkout Pro (Preference + init_point)

**Documentação:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/checkout-customization/preferences

**Como funciona:**
1. Backend cria uma `Preference` via API do Mercado Pago
2. Mercado Pago retorna `init_point` (produção) ou `sandbox_init_point` (teste)
3. Frontend redireciona para essa URL
4. Usuário completa pagamento no site do Mercado Pago
5. Mercado Pago redireciona de volta via `back_urls`

### 3. Debug e Logs

**Arquivo alterado:**
- `app/api/checkout/route.ts`

**Logs adicionados (sem vazar tokens):**
- ✅ Ambiente Node (`NODE_ENV`)
- ✅ Prefixo do token (`TEST-` ou `APP_USR-`)
- ✅ Tipo de ambiente (PRODUÇÃO ou SANDBOX)
- ✅ Payload da preference (sem dados sensíveis)
- ✅ Resposta do Mercado Pago (sem tokens)
- ✅ URL selecionada (sandbox ou produção)

**Exemplo de log:**
```
=== CHECKOUT REQUEST ===
Ambiente Node: development
Token Mercado Pago: APP_USR... (PRODUÇÃO)
Payload recebido: { timelineId: '6933562b...', plan: 'essential', emailDomain: 'gmail.com' }
```

### 4. Correção do Problema Principal

**Arquivo alterado:**
- `app/api/checkout/route.ts`

**Correções:**

1. **notification_url condicional:**
   ```typescript
   // Não enviar notification_url se for localhost
   const notificationUrl = isLocalhost 
     ? undefined 
     : `${cleanSiteUrl}/api/webhooks/mercadopago`
   ```

2. **Seleção correta de URL:**
   ```typescript
   // Token TEST- → sandbox_init_point
   // Token APP_USR- → init_point
   if (isMercadoPagoProduction) {
     checkoutUrl = preference.init_point // PRODUÇÃO
   } else {
     checkoutUrl = preference.sandbox_init_point // SANDBOX
   }
   ```

3. **Validação de campos obrigatórios:**
   - `items`: title, quantity, unit_price (number), currency_id
   - `payer.email`: obrigatório
   - `back_urls`: success, failure, pending
   - `payment_methods`: não excluindo métodos sem querer

4. **Limitação de tamanho:**
   - `description` limitado a 255 caracteres

## 📁 Arquivos Alterados

1. `lib/mercadopago.ts` - Validação de token e logs seguros
2. `lib/supabase.ts` - Validação de service role key
3. `app/api/checkout/route.ts` - Correção do fluxo e logs detalhados

## 🧪 Como Configurar para Produção

### Passo 1: Configurar Variáveis de Ambiente

Crie/atualize `.env.local`:

```env
# Mercado Pago (OBRIGATÓRIO: token de PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu_token_de_producao_aqui

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Site URL (OBRIGATÓRIO: URL pública, não pode ser localhost)
NEXT_PUBLIC_SITE_URL=https://seusite.com
```

**⚠️ IMPORTANTE:**
- Token deve começar com `APP_USR-` (produção)
- `NEXT_PUBLIC_SITE_URL` deve ser uma URL pública válida (HTTPS)
- Não use `localhost` ou `127.0.0.1`

### Passo 2: Verificar Logs do Servidor

Ao criar um checkout, você deve ver logs como:

```
=== CHECKOUT REQUEST (PRODUÇÃO) ===
Ambiente Node: production
Token Mercado Pago: APP_USR... (PRODUÇÃO)
Payload recebido: { timelineId: 'xxx...', plan: 'essential', emailDomain: 'gmail.com' }
URLs configuradas: { success: 'https://seusite.com/...', notification: 'https://seusite.com/api/webhooks/mercadopago' }
Preference payload: { items: [...], payer: {...}, ... }
Preference criada: { id: 'xxx', has_init_point: true, ... }
=== CHECKOUT RESPONSE (PRODUÇÃO) ===
URL de checkout: https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...
```

### Passo 3: Obter Token de Produção

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Vá em **Suas integrações** > **Credenciais**
3. Copie o **Access Token** de **PRODUÇÃO** (começa com `APP_USR-`)
4. Cole no `.env.local`

### Passo 4: Configurar Webhook

1. Acesse [Mercado Pago](https://www.mercadopago.com.br)
2. Vá em **Seu negócio** > **Configurações** > **Webhooks**
3. Clique em **Criar webhook**
4. URL: `https://seusite.com/api/webhooks/mercadopago`
5. Eventos: `payment`, `merchant_order`
6. Salve

### Passo 5: Testar Checkout

1. Acesse seu site em produção
2. Crie uma timeline
3. Clique em "Publicar Página"
4. Preencha o email no checkout
5. Clique em "Pagar com Mercado Pago"
6. **Verifique:** O botão "Pagar" no Mercado Pago deve estar habilitado
7. Complete o pagamento com um cartão real

### Passo 5: Verificar Console do Navegador

Abra DevTools (F12) e verifique:
- ✅ Não há erros no Console
- ✅ A URL de checkout está correta (sandbox em desenvolvimento)
- ✅ O redirecionamento funciona

## ⚠️ Problemas Comuns

### Botão ainda desabilitado?

1. **Verifique o token:**
   - Deve começar com `APP_USR-` (produção)
   - Se começar com `TEST-`, o sistema vai rejeitar

2. **Verifique NEXT_PUBLIC_SITE_URL:**
   - Deve ser uma URL pública (ex: `https://seusite.com`)
   - Não pode ser `localhost` ou `127.0.0.1`
   - Deve usar HTTPS

3. **Verifique os logs:**
   - Procure por erros no servidor
   - Verifique se `init_point` está sendo retornado

4. **Verifique o console do navegador:**
   - Procure por erros JavaScript
   - Verifique se há bloqueios de CORS

5. **Verifique a conta Mercado Pago:**
   - Conta deve estar ativa
   - Validação de identidade completa
   - Métodos de pagamento habilitados

### Erro "notification_url invalid"?

- ✅ `notification_url` sempre é enviada em produção
- ✅ Deve ser uma URL pública válida (HTTPS)
- ⚠️ Não pode ser `localhost`
- ✅ Deve estar acessível publicamente

## 🔒 Segurança

**Garantias:**
- ✅ `MERCADOPAGO_ACCESS_TOKEN` nunca é exposto no client
- ✅ `SUPABASE_SERVICE_ROLE_KEY` nunca é exposto no client
- ✅ Logs mostram apenas prefixos dos tokens (6 caracteres)
- ✅ Validação obrigatória no servidor

**Nunca faça:**
- ❌ Usar `NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN`
- ❌ Usar `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`
- ❌ Logar tokens completos
- ❌ Enviar tokens via props do React

## 📝 Resumo

**Causa raiz:** Mistura de ambientes e notification_url inválida  
**Correção:** Configuração forçada para produção, validação de token e URLs públicas  
**Arquivos:** 3 arquivos alterados  
**Configuração:** Use token `APP_USR-` (produção) e URL pública em `NEXT_PUBLIC_SITE_URL`

## ⚠️ Configuração de Produção

**O sistema está configurado APENAS para produção:**
- ✅ Token deve ser de produção (`APP_USR-`)
- ✅ `NEXT_PUBLIC_SITE_URL` deve ser URL pública (HTTPS)
- ✅ `notification_url` sempre é enviada
- ✅ Sempre usa `init_point` (não `sandbox_init_point`)

