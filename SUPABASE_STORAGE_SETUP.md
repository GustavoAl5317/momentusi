# Configuração do Supabase Storage para Upload de Imagens

## ⚠️ IMPORTANTE: Configurar o Bucket

Para que o upload de imagens funcione corretamente, você precisa criar e configurar o bucket no Supabase Storage.

---

## 📋 Passo a Passo Completo

### 1. Criar o Bucket

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Faça login e selecione seu projeto
3. No menu lateral esquerdo, clique em **Storage**
4. Clique no botão **New bucket** (ou **+ New bucket**)
5. Preencha o formulário:
   - **Name**: `timeline-images` (exatamente este nome)
   - **Public bucket**: ✅ **Marque como SIM** (muito importante para que as imagens sejam acessíveis publicamente!)
   - **File size limit**: `10` MB (ou deixe o padrão)
   - **Allowed MIME types**: Deixe vazio ou adicione `image/*` para aceitar apenas imagens
6. Clique em **Create bucket**

### 2. Configurar Políticas de Acesso (RLS Policies)

Após criar o bucket, você precisa configurar as políticas de Row Level Security (RLS):

#### Opção A: Usando o Dashboard (Recomendado)

1. No Supabase Dashboard, vá em **Storage** > **Policies**
2. Selecione o bucket `timeline-images`
3. Clique em **New Policy** ou **Add Policy**

**Política para Leitura Pública (SELECT):**
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Policy definition**: Cole o seguinte SQL:
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'timeline-images');
```

**Política para Upload (INSERT):**
- **Policy name**: `Public insert access`
- **Allowed operation**: `INSERT`
- **Policy definition**: Cole o seguinte SQL:
```sql
CREATE POLICY "Public insert access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'timeline-images');
```

#### Opção B: Usando SQL Editor

1. Vá em **SQL Editor** no menu lateral
2. Crie uma nova query e cole o seguinte código:

```sql
-- Política para leitura pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'timeline-images');

-- Política para upload (usando service role)
CREATE POLICY "Public insert access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'timeline-images');
```

3. Clique em **Run** para executar

### 3. Verificar Configuração

Após configurar, verifique se:

- ✅ O bucket `timeline-images` existe e está marcado como **Public**
- ✅ As políticas de acesso foram criadas corretamente
- ✅ O arquivo `.env.local` contém:
  ```
  SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
  NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
  ```

### 4. Testar o Upload

1. Acesse a página de criação de timeline (`/create`)
2. Adicione um novo momento
3. Tente fazer upload de uma imagem
4. Se funcionar, você verá a imagem sendo exibida após o upload

---

## 🔧 Troubleshooting

### Erro: "Bucket not found"
- Verifique se o nome do bucket está exatamente como `timeline-images`
- Verifique se você está usando o projeto correto no Supabase

### Erro: "Access denied" ou "Permission denied"
- Verifique se o bucket está marcado como **Public**
- Verifique se as políticas RLS foram criadas corretamente
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurada no `.env.local`

### Erro: "File too large"
- Verifique o limite de tamanho do bucket (deve ser pelo menos 10 MB)
- Reduza o tamanho da imagem antes de fazer upload

### Imagens não aparecem após upload
- Verifique se o bucket está marcado como **Public**
- Verifique se a política de SELECT foi criada
- Verifique o console do navegador para erros de CORS

---

## 📝 Notas Importantes

- O bucket **DEVE** ser público para que as imagens sejam acessíveis na timeline pública
- O upload é feito usando `SUPABASE_SERVICE_ROLE_KEY` no backend (Route Handler `/api/upload`)
- As imagens são armazenadas com nomes únicos (UUID) para evitar conflitos
- O formato recomendado para upload é: JPG, PNG, WebP (até 10 MB)

---

## 🎯 Estrutura de Pastas no Bucket

As imagens serão armazenadas diretamente na raiz do bucket `timeline-images` com nomes únicos:
```
timeline-images/
  ├── uuid-1.jpg
  ├── uuid-2.png
  └── uuid-3.webp
```

Não é necessário criar subpastas, o sistema gera automaticamente nomes únicos para cada imagem.

