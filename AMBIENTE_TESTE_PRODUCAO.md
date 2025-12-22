# 🔄 Como Alternar entre Teste e Produção

O sistema detecta automaticamente o ambiente baseado no token do Mercado Pago.

## 🔍 Detecção Automática

O sistema verifica o prefixo do token:
- **`TEST-`** → Ambiente de **SANDBOX (TESTE)**
- **`APP_USR-`** → Ambiente de **PRODUÇÃO**

**⚠️ IMPORTANTE:** Se você tem um token de teste que começa com `APP_USR-`, pode forçar o modo de teste usando a variável `MERCADOPAGO_ENVIRONMENT=test`.

## 📝 Configuração

### Para TESTE (Sandbox)

No arquivo `.env.local`:

```env
# Token de TESTE (sandbox)
# Se seu token de teste começa com APP_USR-, adicione MERCADOPAGO_ENVIRONMENT=test
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_de_teste_aqui
# OU se o token começa com APP_USR- mas é de teste:
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu_token_de_teste_aqui
# MERCADOPAGO_ENVIRONMENT=test

# Pode usar localhost em teste
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

**Características do modo TESTE:**
- ✅ Aceita `localhost` em `NEXT_PUBLIC_SITE_URL`
- ✅ Usa `sandbox_init_point` do Mercado Pago
- ✅ `notification_url` não é enviada se for localhost
- ✅ Ideal para desenvolvimento e testes

### Para PRODUÇÃO

No arquivo `.env.local`:

```env
# Token de PRODUÇÃO
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu_token_de_producao_aqui

# Deve ser URL pública (HTTPS)
NEXT_PUBLIC_SITE_URL=https://seusite.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

**Características do modo PRODUÇÃO:**
- ❌ **NÃO** aceita `localhost` em `NEXT_PUBLIC_SITE_URL`
- ✅ Usa `init_point` do Mercado Pago
- ✅ `notification_url` sempre é enviada
- ✅ Requer URL pública válida (HTTPS)

## 🔄 Como Alternar

### De Produção para Teste

1. Abra `.env.local`
2. Altere o token:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_de_teste_aqui
   ```
3. Opcionalmente, altere a URL:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Reinicie o servidor:
   ```bash
   npm run dev
   ```

### De Teste para Produção

1. Abra `.env.local`
2. Altere o token:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu_token_de_producao_aqui
   ```
3. Altere a URL para pública:
   ```env
   NEXT_PUBLIC_SITE_URL=https://seusite.com
   ```
4. Reinicie o servidor:
   ```bash
   npm run dev
   ```

## 📊 Verificar Ambiente Atual

Os logs do servidor mostram qual ambiente está ativo:

```
=== CHECKOUT REQUEST ===
Ambiente Node: development
Token Mercado Pago: TEST-... (SANDBOX (TESTE))
```

ou

```
=== CHECKOUT REQUEST ===
Ambiente Node: production
Token Mercado Pago: APP_USR... (PRODUÇÃO)
```

## ⚠️ Validações

### Em TESTE (Sandbox)
- ✅ Aceita `localhost`
- ✅ Aceita `http://` (não precisa HTTPS)
- ✅ `notification_url` opcional

### Em PRODUÇÃO
- ❌ **NÃO** aceita `localhost`
- ✅ Requer URL pública válida
- ✅ `notification_url` sempre enviada
- ✅ Recomendado usar HTTPS

## 🧪 Testar

### Cartões de Teste (Sandbox)

Quando estiver em modo TESTE, use:

**Cartão Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura
- Nome: Qualquer nome

**Cartão Recusado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura

### Em Produção

Use cartões reais para testar (cuidado: serão cobrados de verdade!).

## 🔒 Segurança

**Importante:**
- ✅ Tokens nunca são expostos no client
- ✅ Logs mostram apenas prefixos (6 caracteres)
- ✅ Validação automática de ambiente
- ✅ Erros claros se configuração estiver incorreta

## 📝 Resumo

| Ambiente | Token Prefixo | URL Aceita | notification_url |
|----------|---------------|------------|------------------|
| **TESTE** | `TEST-` | `localhost` ✅ | Opcional |
| **PRODUÇÃO** | `APP_USR-` | Apenas pública ❌ | Sempre enviada |

**Para alternar:** Basta trocar o token no `.env.local` e reiniciar o servidor!

