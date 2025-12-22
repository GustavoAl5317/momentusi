# 🔧 Correção: Coluna 'layout' não encontrada

## ❌ Problema Identificado

O erro mostra que a tabela `timelines` existe, mas está faltando a coluna `layout`:

```
Could not find the 'layout' column of 'timelines' in the schema cache
```

Isso acontece quando a tabela foi criada antes de adicionarmos essa coluna ao schema.

## ✅ Solução

### Passo 1: Executar o Script SQL

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie e cole todo o conteúdo do arquivo `supabase/add-missing-columns.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)

### Passo 2: Verificar se Funcionou

Após executar o script, você deve ver mensagens como:
- `Coluna "layout" adicionada com sucesso`
- Ou `Coluna "layout" já existe` (se já estava presente)

### Passo 3: Recarregar o Schema Cache

O Supabase pode precisar de alguns segundos para atualizar o cache. Se o erro persistir:

1. Aguarde 10-15 segundos
2. Tente criar uma timeline novamente
3. Se ainda não funcionar, vá em **Settings** > **API** > **Reload** (se disponível)

### Passo 4: Testar Novamente

Tente criar uma timeline novamente. O erro deve desaparecer.

## 📝 O que o Script Faz

O script `add-missing-columns.sql`:
- ✅ Adiciona a coluna `layout` se não existir
- ✅ Adiciona outras colunas que possam estar faltando (`theme`, `plan_type`, etc.)
- ✅ Adiciona as constraints necessárias (CHECK, UNIQUE)
- ✅ Não causa erro se as colunas já existirem

## 🔍 Verificar Estrutura da Tabela

Para verificar quais colunas existem na tabela:

1. No Supabase Dashboard, vá em **Table Editor**
2. Selecione a tabela `timelines`
3. Verifique se todas estas colunas existem:
   - `id`
   - `slug`
   - `title`
   - `subtitle`
   - `theme`
   - `layout` ⬅️ **Esta é a que está faltando**
   - `plan_type`
   - `is_published`
   - `is_private`
   - `password_hash`
   - `edit_token`
   - `final_message`
   - `created_at`
   - `updated_at`

