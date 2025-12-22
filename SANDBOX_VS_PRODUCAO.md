# 🔄 Sandbox vs Produção - Mercado Pago

## 📋 Diferenças entre Sandbox e Produção

### 🧪 **Sandbox (Teste)**

**Características:**
- ✅ Ambiente de **teste** - não processa pagamentos reais
- ✅ Token começa com `TEST-`
- ✅ Permite testar todo o fluxo sem gastar dinheiro
- ✅ Webhooks podem ter **atrasos** ou não funcionar perfeitamente
- ✅ URLs de retorno funcionam mesmo em `localhost`
- ⚠️ **Não gera receita real**

**Quando usar:**
- Desenvolvimento local
- Testes de integração
- Validação de fluxo antes de ir para produção

**Limitações:**
- Webhooks podem não chegar em `localhost` (Mercado Pago não consegue acessar sua máquina local)
- Alguns recursos podem ter comportamento diferente

---

### 🚀 **Produção**

**Características:**
- ✅ Ambiente **real** - processa pagamentos reais
- ✅ Token começa com `APP_USR-`
- ✅ Webhooks funcionam **instantaneamente** e de forma confiável
- ✅ Requer URL pública (não funciona com `localhost`)
- ✅ Gera receita real
- ⚠️ **Cuidado:** Pagamentos são reais!

**Quando usar:**
- Site em produção
- Clientes reais pagando
- Ambiente de deploy (Vercel, Railway, Render, etc.)

**Requisitos:**
- `NEXT_PUBLIC_SITE_URL` deve ser uma URL pública (ex: `https://seusite.com`)
- Webhook URL deve ser acessível publicamente
- Certificado SSL (HTTPS) recomendado

---

## 🔧 Como Configurar

### 1. **Sandbox (Teste)**

No arquivo `.env.local`:

```env
# Token de TESTE (sandbox)
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-...

# Opcional: forçar ambiente de teste
MERCADOPAGO_ENVIRONMENT=test

# URL local para desenvolvimento
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. **Produção**

No arquivo `.env.local` (ou variáveis de ambiente do deploy):

```env
# Token de PRODUÇÃO
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890-...

# Opcional: forçar ambiente de produção
MERCADOPAGO_ENVIRONMENT=production

# URL pública do seu site
NEXT_PUBLIC_SITE_URL=https://seusite.com
```

---

## 🔍 Detecção Automática

O sistema detecta automaticamente o ambiente baseado no **prefixo do token**:

- `TEST-` → Sandbox
- `APP_USR-` → Produção

Você pode **forçar** o ambiente usando `MERCADOPAGO_ENVIRONMENT`:

```env
# Forçar sandbox mesmo com token APP_USR-
MERCADOPAGO_ENVIRONMENT=test

# Forçar produção mesmo com token TEST-
MERCADOPAGO_ENVIRONMENT=production
```

---

## ⚠️ Problemas Comuns

### **Problema: Webhook não chega em localhost**

**Causa:** Mercado Pago não consegue acessar `localhost` ou `127.0.0.1`.

**Solução:**
1. Use a página `/buscar-links?timelineId=...` para buscar os links manualmente
2. Ou aguarde alguns minutos e tente novamente na página de sucesso
3. Em produção, os webhooks funcionam normalmente

### **Problema: Links não aparecem após pagamento em sandbox**

**Causa:** Webhook pode ter atraso ou não ter chegado.

**Solução:**
1. Acesse `/buscar-links?timelineId=SEU_TIMELINE_ID`
2. Ou aguarde alguns minutos e recarregue a página de sucesso
3. Verifique os logs do servidor para ver se o webhook foi processado

### **Problema: Em produção, webhook não funciona**

**Causa:** URL do webhook não está acessível ou `NEXT_PUBLIC_SITE_URL` está incorreta.

**Solução:**
1. Verifique se `NEXT_PUBLIC_SITE_URL` é uma URL pública válida (não `localhost`)
2. Verifique se o endpoint `/api/webhooks/mercadopago` está acessível
3. Configure o webhook no painel do Mercado Pago: `https://seusite.com/api/webhooks/mercadopago`

---

## 📊 Comparação Rápida

| Recurso | Sandbox | Produção |
|---------|---------|----------|
| Pagamentos reais | ❌ Não | ✅ Sim |
| Webhooks instantâneos | ⚠️ Pode ter atraso | ✅ Sim |
| Funciona em localhost | ✅ Sim | ❌ Não |
| Requer URL pública | ❌ Não | ✅ Sim |
| Gera receita | ❌ Não | ✅ Sim |
| Token prefixo | `TEST-` | `APP_USR-` |

---

## 🎯 Recomendações

1. **Desenvolvimento:** Use sempre **Sandbox** com `localhost`
2. **Testes:** Use **Sandbox** com URL pública temporária (ex: ngrok)
3. **Produção:** Use **Produção** com URL pública real e HTTPS
4. **Busca de Links:** Em sandbox, use `/buscar-links` se os links não aparecerem automaticamente

---

## 🔗 Links Úteis

- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [Painel de Credenciais](https://www.mercadopago.com.br/developers/panel/credentials)
- [Documentação Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

