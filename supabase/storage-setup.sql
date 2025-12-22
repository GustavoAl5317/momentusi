-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('timeline-images', 'timeline-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload público (opcional, pode ser restrito)
CREATE POLICY "Permitir upload público"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'timeline-images');

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'timeline-images');

