-- Adicionar coluna custom_colors na tabela timelines
-- Esta coluna armazena cores customizadas em formato JSON para o plano completo

ALTER TABLE timelines 
ADD COLUMN IF NOT EXISTS custom_colors JSONB;

-- Comentário explicativo
COMMENT ON COLUMN timelines.custom_colors IS 'Cores customizadas em formato JSON para o plano completo. Campos: primary, secondary, background, text, card';

