# Momenta - Documentação do Projeto

## 📖 Visão Geral

Momenta é um SaaS B2C para criar e compartilhar linhas do tempo de momentos especiais. O produto permite que qualquer pessoa crie uma página pública compartilhável por URL, sem necessidade de login.

## 🎯 Funcionalidades Implementadas

### ✅ MVP Completo

1. **Editor de Linha do Tempo**
   - Interface mobile-first e elegante
   - Título principal e subtítulo opcional
   - Seleção de tema visual
   - Adição, edição e exclusão de momentos

2. **Sistema de Momentos**
   - Data obrigatória
   - Título e descrição
   - Upload de imagem com compressão automática
   - Link de música (Spotify/YouTube)

3. **Planos de Pagamento**
   - **Essencial (R$19,90)**: Até 10 momentos, 1 tema, página pública
   - **Completo (R$39,90)**: Ilimitado, temas premium, privacidade, QR Code, carta final

4. **Sistema de Pagamento**
   - Integração com Mercado Pago
   - Checkout seguro (Checkout Pro)
   - Webhook para confirmação
   - Publicação automática após pagamento

5. **Página Pública**
   - Timeline vertical elegante
   - Responsiva e mobile-first
   - SEO básico (title, meta description, Open Graph)
   - Compartilhamento social
   - QR Code (plano completo)

6. **Sistema de Edição**
   - Token secreto de edição
   - Sem necessidade de login
   - Link enviado por email (após pagamento)

7. **Temas Visuais**
   - Padrão (todos os planos)
   - Romântico, Elegante, Vintage, Moderno (plano completo)

8. **Recursos Premium**
   - Página privada com senha
   - Carta final
   - QR Code
   - Sem marca do site

## 🏗️ Arquitetura

### Frontend
- **Next.js 14** com App Router
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Componentes reutilizáveis**

### Backend
- **Next.js API Routes**
- **Supabase** (PostgreSQL + Storage)
- **Mercado Pago** para pagamentos

### Banco de Dados
- `timelines`: Linhas do tempo
- `moments`: Momentos de cada timeline
- `payments`: Registro de pagamentos

## 📁 Estrutura de Arquivos

```
├── app/
│   ├── api/              # API Routes
│   │   ├── checkout/     # Checkout Mercado Pago
│   │   ├── timelines/    # CRUD de timelines
│   │   ├── timeline/     # Buscar timeline pública
│   │   ├── upload/       # Upload de imagens
│   │   └── webhooks/     # Webhook Mercado Pago
│   ├── [slug]/           # Página pública da timeline
│   ├── create/           # Criar nova timeline
│   ├── edit/             # Editar timeline (com token)
│   ├── checkout/         # Página de checkout
│   └── success/          # Página de sucesso
├── components/
│   ├── TimelineEditor.tsx    # Editor principal
│   ├── TimelineView.tsx      # Visualização pública
│   ├── MomentForm.tsx        # Formulário de momento
│   └── MomentList.tsx        # Lista de momentos
├── lib/
│   ├── supabase.ts       # Cliente Supabase
│   └── mercadopago.ts    # Cliente Mercado Pago
├── types/
│   └── index.ts          # Tipos TypeScript
└── supabase/
    ├── schema.sql        # Schema do banco
    └── storage-setup.sql # Configuração de storage
```

## 🔄 Fluxo de Uso

1. **Criação**
   - Usuário acessa `/create`
   - Preenche título, subtítulo, escolhe plano
   - Adiciona momentos
   - Clica em "Publicar"

2. **Pagamento**
   - Redirecionado para `/checkout`
   - Informa email
   - Processa pagamento via Mercado Pago
   - Webhook confirma pagamento

3. **Publicação**
   - Timeline publicada automaticamente
   - URL gerada: `site.com/slug-amigavel`
   - Email enviado com links (página + edição)

4. **Visualização**
   - Página pública acessível por URL
   - Compartilhável
   - Responsiva

5. **Edição**
   - Link secreto de edição
   - Acesso via `/edit?token=...`
   - Edição completa da timeline

## 🔐 Segurança

- Tokens secretos para edição (sem login)
- Validação de webhooks do Mercado Pago
- Sanitização de inputs
- Senhas hasheadas (SHA-256)
- Políticas de storage no Supabase

## 🚀 Deploy

### Pré-requisitos
- Conta Supabase
- Conta Mercado Pago
- Domínio (opcional)

### Passos
1. Configure variáveis de ambiente
2. Execute schema SQL no Supabase
3. Configure webhook no Mercado Pago
4. Deploy no Vercel/Railway/Render

## 📝 Próximas Melhorias

- [ ] Envio de emails (Resend/SendGrid)
- [ ] Analytics de visualização
- [ ] Domínio personalizado
- [ ] Mais temas visuais
- [ ] Modo apresentação (slideshow)
- [ ] Exportação em PDF
- [ ] Integração com redes sociais

## 🐛 Problemas Conhecidos

- Email não implementado (apenas logs)
- Modo apresentação não implementado
- Analytics não implementado

## 📄 Licença

Este projeto é um MVP desenvolvido para fins educacionais e comerciais.

