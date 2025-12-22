-- Políticas RLS (Row Level Security) 
-- IMPORTANTE: O Service Role Key normalmente bypassa RLS automaticamente
-- Mas se RLS estiver habilitado e bloqueando, você pode:

-- OPÇÃO 1: Desabilitar RLS completamente (mais simples para desenvolvimento)
ALTER TABLE timelines DISABLE ROW LEVEL SECURITY;
ALTER TABLE moments DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- OPÇÃO 2: Manter RLS habilitado mas criar políticas permissivas
-- Descomente as linhas abaixo se quiser usar RLS com políticas:

-- ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow all operations" ON timelines;
-- CREATE POLICY "Allow all operations" ON timelines
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow all operations" ON moments;
-- CREATE POLICY "Allow all operations" ON moments
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow all operations" ON payments;
-- CREATE POLICY "Allow all operations" ON payments
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

