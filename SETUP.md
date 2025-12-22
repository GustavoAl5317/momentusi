# Guia de Configuração - Momenta

Este guia irá ajudá-lo a configurar o projeto Momenta do zero.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Conta no Mercado Pago (para pagamentos)
- Git (opcional)

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o script em `supabase/schema.sql`
4. Vá em **Storage** e crie um bucket chamado `timeline-images` (público)
5. Copie as credenciais:
   - Project URL
   - Anon/Public Key
   - Service Role Key

### 3. Configurar Mercado Pago

1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br) e crie uma conta
2. Vá em **Seu negócio > Configurações > Credenciais**
3. Copie o **Access Token** (Token de Acesso)
4. Configure webhook:
   - Vá em **Seu negócio > Configurações > Webhooks**
   - Clique em **Criar webhook**
   - URL: `https://seu-dominio.com/api/webhooks/mercadopago`
   - Eventos: `payment`, `merchant_order`
   - Salve a configuração

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_mercadopago

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Para produção**, altere `NEXT_PUBLIC_SITE_URL` para seu domínio real.

### 5. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🧪 Testar Pagamentos

Para testar pagamentos no Mercado Pago em modo de desenvolvimento:

1. Use os cartões de teste do Mercado Pago:
   - Aprovado: `5031 7557 3453 0604`
   - Recusado: `5031 4332 1540 6351`
   - Qualquer data futura e CVV

2. Use o Access Token de teste (sandbox) do Mercado Pago
3. Configure o webhook no painel do Mercado Pago apontando para sua URL

## 📦 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático!

### Outras Plataformas

- **Railway**: Similar ao Vercel
- **Render**: Configure variáveis de ambiente
- **Netlify**: Pode precisar de ajustes para API routes

## 🔧 Troubleshooting

### Erro ao fazer upload de imagens
- Verifique se o bucket `timeline-images` existe no Supabase
- Verifique se o bucket está configurado como público

### Webhook não funciona
- Verifique se a URL do webhook está correta no painel do Mercado Pago
- Verifique os logs no painel do Mercado Pago
- Certifique-se de que a URL está acessível publicamente

### Erro de CORS
- Verifique se `NEXT_PUBLIC_SITE_URL` está correto
- Adicione seu domínio nas configurações do Supabase

## 📝 Próximos Passos

- [ ] Configurar envio de emails (Resend, SendGrid, etc.)
- [ ] Adicionar analytics
- [ ] Implementar domínio personalizado
- [ ] Adicionar mais temas
- [ ] Implementar estatísticas de visualização

## 🆘 Suporte

Em caso de dúvidas, consulte a documentação:
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)

