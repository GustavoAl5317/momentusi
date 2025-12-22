# Momenta - Linha do Tempo de Momentos Especiais

SaaS B2C para criar e compartilhar linhas do tempo de momentos importantes.

## 🚀 Tecnologias

- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Banco de Dados:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Pagamento:** Stripe
- **Deploy:** Vercel

## 📋 Funcionalidades

### Plano Essencial (R$19,90)
- Até 10 momentos
- 1 tema visual
- Página pública
- URL permanente
- Marca discreta no rodapé

### Plano Completo (R$39,90)
- Momentos ilimitados
- Temas premium
- Sem marca do site
- Página privada (senha opcional)
- Modo apresentação
- Carta final
- QR Code

## 🛠️ Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (crie `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Execute o projeto:
```bash
npm run dev
```

## 📝 Schema do Banco de Dados

Execute os scripts SQL no Supabase para criar as tabelas necessárias.

## 🔐 Segurança

- Tokens secretos para edição (sem login obrigatório)
- Validação de webhooks do Stripe
- Sanitização de inputs
- Rate limiting nas APIs

