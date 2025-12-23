-- Adicionar coluna email na tabela payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Criar índice para busca por email
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);

