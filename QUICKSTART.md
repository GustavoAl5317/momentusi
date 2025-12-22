# 🚀 Quick Start - Momenta

## Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 3. Configurar Supabase
# - Execute supabase/schema.sql no SQL Editor
# - Execute supabase/storage-setup.sql
# - Crie bucket 'timeline-images' no Storage

# 4. Configurar Stripe
# - Adicione webhook: https://seu-dominio.com/api/webhooks/stripe
# - Eventos: checkout.session.completed, checkout.session.async_payment_failed

# 5. Executar
npm run dev
```

## 📝 Checklist de Configuração

- [ ] Supabase configurado
- [ ] Tabelas criadas (schema.sql)
- [ ] Bucket de storage criado
- [ ] Stripe configurado
- [ ] Webhook configurado
- [ ] Variáveis de ambiente preenchidas
- [ ] Teste local funcionando

## 🧪 Testar Localmente

1. Acesse http://localhost:3000
2. Crie uma timeline
3. Use cartão de teste: `4242 4242 4242 4242`
4. Verifique webhook com Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## 📚 Documentação Completa

Veja `SETUP.md` para instruções detalhadas.

