-- Adicionar coluna image_urls para suportar múltiplas imagens
ALTER TABLE moments
ADD COLUMN IF NOT EXISTS image_urls JSONB;

-- Criar índice para melhorar performance em consultas
CREATE INDEX IF NOT EXISTS idx_moments_image_urls ON moments USING GIN (image_urls);

