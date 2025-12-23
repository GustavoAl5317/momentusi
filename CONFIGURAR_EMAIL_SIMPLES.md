# 📧 Como Configurar Email (Sem Email Comercial)

## ✅ Você NÃO precisa de email comercial!

O sistema funciona perfeitamente usando o **domínio de teste do Resend**, que não requer verificação de domínio.

## 🚀 Passo a Passo (5 minutos)

### 1. Criar Conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Clique em **Sign Up** (pode usar Google/GitHub)
3. Confirme seu email

### 2. Obter API Key

1. No dashboard do Resend, vá em **API Keys** (menu lateral)
2. Clique em **Create API Key**
3. Dê um nome (ex: "Momentusi Production")
4. Copie a chave (ela só aparece uma vez!)

### 3. Configurar no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Clique em **Add New**
4. Adicione:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Cole a chave que você copiou (começa com `re_`)
   - **Environment**: Selecione **Production** (e **Preview** se quiser)
5. Clique em **Save**

### 4. Pronto! 🎉

O sistema automaticamente usará `onboarding@resend.dev` como remetente. Não precisa configurar mais nada!

## 📊 Limites Gratuitos

- ✅ **100 emails por dia** (gratuito)
- ✅ Funciona em produção
- ✅ Sem necessidade de verificar domínio
- ✅ Sem necessidade de email comercial

## 🔍 Como Verificar se Está Funcionando

1. Faça um pagamento de teste
2. Verifique os logs do Vercel
3. Você deve ver: `✅ Email de confirmação enviado com sucesso: msg_xxxxx`
4. Verifique a caixa de entrada (e spam) do email do cliente

## 💡 Dica

Se no futuro você quiser usar um domínio próprio (ex: `noreply@momentusi.com`):

1. Compre um domínio
2. No Resend, adicione o domínio
3. Configure os registros DNS
4. Adicione `RESEND_FROM_EMAIL=Momentusi <noreply@seu-dominio.com>` no Vercel

Mas isso é **opcional** - o domínio de teste funciona perfeitamente!

## ❓ Problemas?

### Email não está sendo enviado

1. ✅ Verifique se `RESEND_API_KEY` está configurado no Vercel
2. ✅ Verifique se a chave está correta (começa com `re_`)
3. ✅ Verifique os logs do Vercel para erros
4. ✅ Verifique se não excedeu o limite de 100 emails/dia

### Email vai para spam

- O domínio de teste pode ir para spam em alguns provedores
- Para produção, considere usar um domínio próprio (opcional)

