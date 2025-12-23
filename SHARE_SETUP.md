# 📤 Configuração de Compartilhamento

Este documento explica como configurar o sistema de compartilhamento da timeline, incluindo envio de emails e compartilhamento em redes sociais.

## 🎯 Funcionalidades Implementadas

### ✅ Compartilhamento em Redes Sociais
- WhatsApp
- Facebook
- Twitter/X
- LinkedIn
- Telegram

### ✅ Envio por Email
- Envio de links personalizados por email
- Templates HTML responsivos
- Suporte a Resend API

### ✅ QR Code para Stories
- Geração de QR code estilizado
- Download em PNG para compartilhar em stories
- Design personalizado por tema

### ✅ Link Personalizado
- Copiar link para área de transferência
- Links únicos por timeline

## 📧 Configuração de Email (Resend)

Para habilitar o envio de emails, você precisa configurar o Resend:

### 1. Criar conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu domínio ou use o domínio de teste

### 2. Obter API Key

1. No dashboard do Resend, vá em **API Keys**
2. Clique em **Create API Key**
3. Copie a chave gerada

### 3. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no seu `.env`:

```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email do remetente (deve ser verificado no Resend)
RESEND_FROM_EMAIL=Momenta <noreply@seu-dominio.com>
```

### 4. Verificar Domínio (Produção)

Para usar em produção:

1. No Resend, vá em **Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde a verificação

**Nota:** Em desenvolvimento, você pode usar o domínio de teste do Resend sem verificação.

## 🚀 Como Usar

### Para Usuários

1. Na página da timeline, clique em **Compartilhar**
2. Escolha uma das opções:
   - **Redes Sociais**: Compartilhe diretamente em WhatsApp, Facebook, Twitter, etc.
   - **Email**: Envie o link por email para alguém
   - **QR Code**: Baixe o QR code para compartilhar em stories

### Compartilhamento em Redes Sociais

O sistema abre uma nova janela com o compartilhador nativo de cada rede social, permitindo que o usuário escolha onde compartilhar.

### Envio por Email

1. Clique na aba **Email**
2. Digite o email do destinatário
3. Clique em **Enviar por Email**
4. O destinatário receberá um email bonito com o link da timeline

### QR Code para Stories

1. Clique na aba **QR Code**
2. Clique em **Baixar QR Code**
3. O QR code será baixado como PNG
4. Compartilhe no Instagram Stories, WhatsApp Status, etc.

## 🎨 Personalização por Tema

O modal de compartilhamento se adapta automaticamente ao tema da timeline:

- **Default**: Rosa/Roxo
- **Romantic**: Rosa/Rose
- **Elegant**: Cinza/Slate
- **Vintage**: Âmbar/Laranja
- **Modern**: Azul/Cyan

## 🔧 Desenvolvimento

### Sem Resend Configurado

Se `RESEND_API_KEY` não estiver configurado, o sistema:
- Mostra um aviso no console
- Retorna sucesso simulado
- Permite testar a interface sem enviar emails reais

### Testando Email

Para testar o envio de email:

1. Configure o `RESEND_API_KEY`
2. Use um email de teste do Resend
3. Verifique a caixa de entrada (e spam)

## 📝 Estrutura de Arquivos

```
components/
  └── ShareModal.tsx          # Modal de compartilhamento
app/
  └── api/
      └── share/
          └── send-email/
              └── route.ts    # API de envio de email
```

## 🐛 Troubleshooting

### Email não está sendo enviado

1. Verifique se `RESEND_API_KEY` está configurado
2. Verifique se o domínio está verificado no Resend
3. Verifique os logs do servidor
4. Verifique a caixa de spam do destinatário

### QR Code não baixa

1. Verifique se o navegador suporta download de arquivos
2. Verifique o console do navegador para erros
3. Tente em outro navegador

### Compartilhamento não funciona

1. Verifique se os pop-ups estão bloqueados
2. Tente em modo anônimo
3. Verifique se as URLs das redes sociais estão acessíveis

## 📚 Recursos

- [Resend Documentation](https://resend.com/docs)
- [QR Code React](https://www.npmjs.com/package/qrcode.react)
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

## 🔐 Segurança

- Emails são validados antes do envio
- API keys nunca são expostas no frontend
- Links são gerados de forma segura
- Validação de entrada em todas as APIs

## 💡 Próximas Melhorias

- [ ] Analytics de compartilhamento
- [ ] Personalização de mensagem de email
- [ ] QR code com logo personalizado
- [ ] Compartilhamento programado
- [ ] Integração com mais redes sociais





