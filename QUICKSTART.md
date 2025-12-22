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

# 4. Configurar Mercado Pago
# - Configure MERCADOPAGO_ACCESS_TOKEN no .env.local
# - Adicione webhook: https://seu-dominio.com/api/webhooks/mercadopago
# - Eventos: payment (todos os status)

# 5. Executar
npm run dev
```

## 📝 Checklist de Configuração

- [ ] Supabase configurado
- [ ] Tabelas criadas (schema.sql)
- [ ] Bucket de storage criado
- [ ] Mercado Pago configurado
- [ ] Webhook configurado
- [ ] Variáveis de ambiente preenchidas
- [ ] Teste local funcionando

## 🧪 Testar Localmente

1. Acesse http://localhost:3000
2. Crie uma timeline
3. Teste o checkout com Mercado Pago (sandbox)
4. Verifique os logs do webhook no console

## 📚 Documentação Completa

Veja `SETUP.md` para instruções detalhadas.

