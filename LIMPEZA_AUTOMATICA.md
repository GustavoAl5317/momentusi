# 🧹 Limpeza Automática de Pagamentos Pendentes

## 📋 O que faz

Este script remove automaticamente:
- **Timelines** não publicadas há mais de 23 horas sem pagamento aprovado
- **Pagamentos** pendentes ou falhados há mais de 23 horas
- **Momentos** relacionados às timelines removidas

## ⚠️ Critérios de Exclusão

Uma timeline será removida se:
1. ✅ Não está publicada (`is_published = false`)
2. ✅ Foi criada há mais de 23 horas
3. ✅ Não tem pagamento aprovado (`status = 'succeeded'`)

**Importante:** Timelines com pagamento aprovado NUNCA serão removidas, mesmo que não estejam publicadas.

## 🚀 Como Configurar

### Opção 1: Executar Manualmente (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o script `supabase/cleanup-pending-payments.sql`
4. Para executar a limpeza manualmente:
   ```sql
   SELECT cleanup_pending_payments();
   ```

### Opção 2: Agendar com pg_cron (Automático)

Se o Supabase tiver `pg_cron` habilitado:

1. Execute o script `supabase/cleanup-pending-payments.sql`
2. Descomente as linhas do `cron.schedule` no final do arquivo
3. O job será executado automaticamente a cada hora

**Nota:** Nem todos os projetos Supabase têm `pg_cron` habilitado. Verifique nas configurações do seu projeto.

### Opção 3: Usar Edge Functions (Vercel Cron)

Você pode criar uma API route no Next.js e agendar no Vercel:

1. Criar arquivo `app/api/cron/cleanup/route.ts`
2. Configurar no Vercel: **Settings > Cron Jobs**
3. Agendar para executar diariamente

## 📊 Verificar Antes de Executar

Para ver quantas timelines seriam removidas:

```sql
SELECT 
  COUNT(*) as timelines_para_remover,
  COUNT(DISTINCT t.id) as total_timelines,
  COUNT(DISTINCT p.id) as total_payments_pendentes
FROM timelines t
LEFT JOIN payments p ON p.timeline_id = t.id
WHERE 
  t.is_published = false
  AND t.created_at < NOW() - INTERVAL '23 hours'
  AND (
    p.id IS NULL 
    OR (
      p.status IN ('pending', 'failed') 
      AND p.created_at < NOW() - INTERVAL '23 hours'
    )
  )
  AND NOT EXISTS (
    SELECT 1 FROM payments p2 
    WHERE p2.timeline_id = t.id 
    AND p2.status = 'succeeded'
  );
```

## 🔍 Ver Resultados

Após executar a limpeza:

```sql
SELECT cleanup_pending_payments();
```

Retorna:
- `deleted_timelines`: Quantidade de timelines removidas
- `deleted_payments`: Quantidade de pagamentos removidos
- `deleted_moments`: Quantidade de momentos removidos

## ⚙️ Configuração Recomendada

**Executar diariamente às 2h da manhã:**

1. No Supabase Dashboard, vá em **Database > Extensions**
2. Verifique se `pg_cron` está habilitado
3. Se não estiver, habilite (pode requerer upgrade do plano)
4. Execute:

```sql
SELECT cron.schedule(
  'cleanup-pending-payments-daily',
  '0 2 * * *',  -- Todo dia às 2h da manhã
  $$SELECT cleanup_pending_payments();$$
);
```

## 🛡️ Segurança

- A função usa `SECURITY DEFINER` para executar com privilégios elevados
- Apenas remove timelines não publicadas sem pagamento aprovado
- Timelines com pagamento aprovado são protegidas
- Timelines criadas há menos de 23 horas são protegidas

## 📝 Notas

- O intervalo de 23 horas dá tempo suficiente para pagamentos Pix serem processados
- Pagamentos aprovados nunca são removidos
- A limpeza é segura e não afeta dados importantes

