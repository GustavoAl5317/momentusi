-- Script para limpar timelines com pagamentos pendentes há mais de 23 horas
-- Este script remove timelines e todos os dados relacionados quando o pagamento não foi aprovado após 23 horas

-- Função para limpar pagamentos pendentes antigos
CREATE OR REPLACE FUNCTION cleanup_pending_payments()
RETURNS TABLE(
  deleted_timelines INTEGER,
  deleted_payments INTEGER,
  deleted_moments INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_timelines INTEGER := 0;
  v_deleted_payments INTEGER := 0;
  v_deleted_moments INTEGER := 0;
BEGIN
  -- Deletar momentos de timelines que serão removidas
  WITH timelines_to_delete AS (
    SELECT t.id
    FROM timelines t
    LEFT JOIN payments p ON p.timeline_id = t.id
    WHERE 
      -- Timeline não está publicada
      t.is_published = false
      AND (
        -- Não tem pagamento OU pagamento está pendente/falhou há mais de 23 horas
        p.id IS NULL 
        OR (
          p.status IN ('pending', 'failed') 
          AND p.created_at < NOW() - INTERVAL '23 hours'
        )
      )
      -- Timeline foi criada há mais de 23 horas
      AND t.created_at < NOW() - INTERVAL '23 hours'
  )
  SELECT COUNT(*) INTO v_deleted_moments
  FROM moments m
  WHERE m.timeline_id IN (SELECT id FROM timelines_to_delete);
  
  -- Deletar os momentos
  DELETE FROM moments
  WHERE timeline_id IN (
    SELECT t.id
    FROM timelines t
    LEFT JOIN payments p ON p.timeline_id = t.id
    WHERE 
      t.is_published = false
      AND (
        p.id IS NULL 
        OR (
          p.status IN ('pending', 'failed') 
          AND p.created_at < NOW() - INTERVAL '23 hours'
        )
      )
      AND t.created_at < NOW() - INTERVAL '23 hours'
  );
  
  -- Deletar pagamentos relacionados
  DELETE FROM payments
  WHERE timeline_id IN (
    SELECT t.id
    FROM timelines t
    WHERE 
      t.is_published = false
      AND t.created_at < NOW() - INTERVAL '23 hours'
      AND NOT EXISTS (
        SELECT 1 FROM payments p2 
        WHERE p2.timeline_id = t.id 
        AND p2.status = 'succeeded'
      )
  )
  RETURNING id INTO v_deleted_payments;
  
  -- Deletar timelines não publicadas sem pagamento aprovado há mais de 23 horas
  DELETE FROM timelines
  WHERE 
    is_published = false
    AND created_at < NOW() - INTERVAL '23 hours'
    AND NOT EXISTS (
      SELECT 1 FROM payments p 
      WHERE p.timeline_id = timelines.id 
      AND p.status = 'succeeded'
    )
  RETURNING id INTO v_deleted_timelines;
  
  RETURN QUERY SELECT v_deleted_timelines, v_deleted_payments, v_deleted_moments;
END;
$$;

-- Criar função para executar a limpeza (pode ser chamada manualmente ou agendada)
CREATE OR REPLACE FUNCTION run_cleanup_pending_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result RECORD;
BEGIN
  SELECT * INTO result FROM cleanup_pending_payments();
  
  RAISE NOTICE 'Limpeza concluída: % timelines, % payments, % moments deletados', 
    result.deleted_timelines, 
    result.deleted_payments, 
    result.deleted_moments;
END;
$$;

-- Se o Supabase tiver pg_cron habilitado, criar job agendado
-- Descomente as linhas abaixo se pg_cron estiver disponível
-- SELECT cron.schedule(
--   'cleanup-pending-payments',           -- Nome do job
--   '0 * * * *',                          -- Executar a cada hora (cron format)
--   $$SELECT cleanup_pending_payments();$$ -- Função a executar
-- );

-- Para executar manualmente:
-- SELECT cleanup_pending_payments();
-- ou
-- SELECT run_cleanup_pending_payments();

