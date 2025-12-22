# 🔧 Correção: Coluna mercado_pago_payment_id não encontrada

## ❌ Problema Identificado

O erro mostra que a tabela `payments` existe, mas está faltando a coluna `mercado_pago_payment_id`:

```
Could not find the 'mercado_pago_payment_id' column of 'payments' in the schema cache
```

Isso acontece quando a tabela foi criada antes de adicionarmos essa coluna ao schema (provavelmente ainda tem a coluna antiga do Stripe).

## ✅ Solução

### Passo 1: Executar o Script SQL

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie e cole todo o conteúdo do arquivo `supabase/add-payments-column.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)

### Passo 2: Verificar se Funcionou

Após executar o script, você deve ver mensagens como:
- `Coluna "mercado_pago_payment_id" adicionada com sucesso`
- Ou `Coluna "mercado_pago_payment_id" já existe` (se já estava presente)

### Passo 3: Recarregar o Schema Cache

O Supabase pode precisar de alguns segundos para atualizar o cache. Se o erro persistir:

1. Aguarde 10-15 segundos
2. Tente criar um checkout novamente
3. Se ainda não funcionar, vá em **Settings** > **API** > **Reload** (se disponível)

### Passo 4: Testar Novamente

Tente criar um checkout novamente. O erro deve desaparecer.

## 📝 O que o Script Faz

O script `add-payments-column.sql`:
- ✅ Adiciona a coluna `mercado_pago_payment_id` se não existir
- ✅ Cria o índice único para essa coluna
- ✅ Remove a coluna antiga `stripe_payment_intent_id` se existir
- ✅ Adiciona outras colunas que possam estar faltando (`plan_type`, `amount`, `status`, `timeline_id`)
- ✅ Não causa erro se as colunas já existirem

## 🔍 Verificar Estrutura da Tabela

Para verificar quais colunas existem na tabela:

1. No Supabase Dashboard, vá em **Table Editor**
2. Selecione a tabela `payments`
3. Verifique se todas estas colunas existem:
   - `id`
   - `timeline_id`
   - `mercado_pago_payment_id` ⬅️ **Esta é a que está faltando**
   - `plan_type`
   - `amount`
   - `status`
   - `created_at`
   - `updated_at`

