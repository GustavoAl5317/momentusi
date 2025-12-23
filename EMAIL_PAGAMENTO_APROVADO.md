# 📧 Email Automático de Confirmação de Pagamento

## 🎯 Funcionalidade

Quando um pagamento é aprovado pelo Mercado Pago, o sistema automaticamente envia um email para o cliente com:

- ✅ Confirmação de pagamento aprovado
- 🔗 Link público da timeline (para compartilhar)
- ✏️ Link de edição da timeline (privado)
- 📖 Instruções de como usar
- 📋 Informações do plano contratado

## 🚀 Como Funciona

1. **Checkout**: Quando o cliente inicia o checkout, o email é salvo no banco de dados junto com o payment
2. **Pagamento Aprovado**: Quando o webhook do Mercado Pago recebe confirmação de pagamento aprovado
3. **Envio Automático**: O sistema busca os dados da timeline e envia o email automaticamente
4. **Links Gerados**: Os links são gerados automaticamente baseados no slug e edit_token da timeline

## 📋 Configuração Necessária

### 1. Adicionar Coluna Email no Banco

Execute o SQL no Supabase:

```sql
-- Arquivo: supabase/add-email-to-payments.sql
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
```

### 2. Configurar Resend API

O sistema usa **Resend** para envio de emails. Configure as variáveis de ambiente:

#### Opção 1: Usar Domínio de Teste (Recomendado - Sem Email Comercial)

**Você NÃO precisa de email comercial!** O Resend oferece um domínio de teste que funciona sem verificação:

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita (100 emails/dia grátis)
3. Vá em **API Keys** e crie uma nova chave
4. Copie a chave

#### No `.env.local` (desenvolvimento):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
# Não precisa configurar RESEND_FROM_EMAIL - usará domínio de teste automaticamente
```

#### No Vercel (produção):

1. Acesse **Settings** > **Environment Variables**
2. Adicione apenas:
   - `RESEND_API_KEY`: Sua chave API do Resend
   - **NÃO precisa** adicionar `RESEND_FROM_EMAIL` - o sistema usa `onboarding@resend.dev` automaticamente

**✅ Pronto!** O sistema usará `onboarding@resend.dev` como remetente (domínio de teste do Resend).

#### Opção 2: Usar Seu Próprio Domínio (Opcional - Futuro)

Se no futuro você quiser usar um domínio próprio:

1. No Resend, vá em **Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde a verificação
5. Configure `RESEND_FROM_EMAIL=Momentusi <noreply@seu-dominio.com>`

**Nota:** O domínio de teste (`onboarding@resend.dev`) funciona perfeitamente em produção também!

## 📧 Template do Email

O email inclui:

- **Header**: Gradiente roxo com emoji de celebração
- **Confirmação**: Mensagem de pagamento aprovado
- **Informações do Plano**: Tipo de plano contratado
- **Link Público**: Botão destacado para compartilhar
- **Link de Edição**: Botão amarelo com aviso de privacidade
- **Instruções**: Como usar cada link
- **Footer**: Informações de contato

## 🔍 Verificação

### Logs do Servidor

Após um pagamento aprovado, você deve ver nos logs:

```
✅ Pagamento processado com sucesso: { timelineId: '...', slug: '...' }
✅ Email de confirmação enviado com sucesso: msg_xxxxx
```

### Se o Email Não For Enviado

1. Verifique se `RESEND_API_KEY` está configurado
2. Verifique se o domínio está verificado no Resend
3. Verifique os logs do servidor para erros
4. Verifique se o email foi salvo no payment (campo `email` na tabela `payments`)

### Fallback

Se `RESEND_API_KEY` não estiver configurado:
- O sistema não falhará (o webhook continuará funcionando)
- Um aviso será logado: `⚠️ RESEND_API_KEY não configurado - email não será enviado`
- O pagamento será processado normalmente, apenas sem envio de email

### Sem Email Comercial

**Não tem problema!** Você pode usar o domínio de teste do Resend:
- ✅ Funciona sem verificar domínio
- ✅ Funciona em produção
- ✅ 100 emails/dia grátis
- ✅ Basta criar conta no Resend e pegar a API Key
- ✅ O sistema usa `onboarding@resend.dev` automaticamente

## 📝 Arquivos Modificados

- `app/api/checkout/route.ts`: Salva email no payment
- `app/api/webhooks/mercadopago/route.ts`: Envia email quando pagamento aprovado
- `lib/email.ts`: Função de envio de email (novo arquivo)
- `types/index.ts`: Adicionado campo `email` no tipo `Payment`
- `supabase/add-email-to-payments.sql`: SQL para adicionar coluna (novo arquivo)

## 🎨 Personalização

Para personalizar o template do email, edite a função `generatePaymentConfirmationHTML` em `lib/email.ts`.

## 🐛 Troubleshooting

### Email não está sendo enviado

1. ✅ Verifique se `RESEND_API_KEY` está configurado
2. ✅ Verifique se o domínio está verificado no Resend
3. ✅ Verifique se o email foi salvo no payment (consulte tabela `payments`)
4. ✅ Verifique os logs do servidor para erros específicos

### Email vai para spam

1. Configure SPF, DKIM e DMARC no Resend
2. Use um domínio verificado (não o domínio de teste)
3. Evite palavras que podem ser consideradas spam no assunto

### Erro "RESEND_API_KEY não configurado"

Configure a variável de ambiente `RESEND_API_KEY` no Vercel ou `.env.local`.

