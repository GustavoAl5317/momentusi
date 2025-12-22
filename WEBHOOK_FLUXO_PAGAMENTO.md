# 🔄 Fluxo Após Pagamento - Mercado Pago

## 📋 O que acontece após o pagamento

### 1. Usuário completa pagamento no Mercado Pago

Quando o usuário completa o pagamento no checkout do Mercado Pago:

1. Mercado Pago processa o pagamento
2. Mercado Pago redireciona para `back_urls.success` com parâmetros
3. Mercado Pago envia webhook para `notification_url`

### 2. Webhook recebe notificação

O webhook (`/api/webhooks/mercadopago`) recebe uma notificação com:

```json
{
  "type": "payment",
  "action": "payment.created",
  "data": {
    "id": "123456789", // ID do pagamento (não da preference)
    "status": "approved",
    "external_reference": "timeline-id-uuid" // timelineId que passamos
  }
}
```

### 3. Processamento do webhook

O webhook:
1. ✅ Busca o payment no banco usando `external_reference` (timelineId)
2. ✅ Atualiza o status do payment para `succeeded`
3. ✅ Atualiza o `mercado_pago_payment_id` com o ID real do payment
4. ✅ Publica a timeline (`is_published: true`)
5. ✅ Atualiza o `plan_type` da timeline

### 4. Página de sucesso

A página `/success?timelineId=...`:
1. Aguarda 2 segundos para o webhook processar
2. Verifica o status do pagamento via `/api/timelines/[id]/check-status`
3. Busca os dados da timeline publicada via `/api/timelines/[id]/published`
4. Mostra os links:
   - Link público da timeline (`/${slug}`)
   - Link de edição (`/edit?token=...`)

## 🔍 Como verificar se funcionou

### Verificar logs do servidor

Após pagar, você deve ver nos logs:

```
=== WEBHOOK RECEBIDO ===
Tipo: payment
Action: payment.created
Processando pagamento: { paymentId: '...', status: 'approved', externalReference: '...' }
Payment encontrado por external_reference: ...
✅ Payment atualizado com sucesso
✅ Timeline publicada com sucesso
✅ Pagamento processado com sucesso: { timelineId: '...', slug: '...' }
```

### Verificar no banco de dados

1. Acesse Supabase Dashboard > Table Editor
2. Verifique a tabela `payments`:
   - Deve ter um registro com `status: 'succeeded'`
   - `mercado_pago_payment_id` deve estar preenchido
3. Verifique a tabela `timelines`:
   - `is_published` deve ser `true`
   - `plan_type` deve estar correto

### Verificar manualmente

Acesse: `/api/timelines/[timelineId]/check-status`

Deve retornar:
```json
{
  "timeline": {
    "is_published": true,
    "slug": "meu-slug",
    ...
  },
  "payment": {
    "status": "succeeded",
    ...
  }
}
```

## ⚠️ Problemas Comuns

### Webhook não está sendo chamado

**Causas:**
1. `notification_url` não está configurada (localhost em sandbox)
2. URL não está acessível publicamente
3. Webhook não está configurado no Mercado Pago

**Solução:**
- Em sandbox/localhost, o webhook pode não funcionar
- Use a rota `/api/timelines/[id]/check-status` para verificar manualmente
- Em produção, configure o webhook no painel do Mercado Pago

### Payment não encontrado no webhook

**Causa:** O `external_reference` não está sendo encontrado

**Solução:**
- Verifique se o `timelineId` está sendo passado corretamente na preference
- Verifique os logs do webhook para ver o `external_reference` recebido

### Timeline não está sendo publicada

**Causa:** Webhook não processou ou payment não foi encontrado

**Solução:**
1. Verifique os logs do webhook
2. Verifique se o payment existe no banco
3. Use `/api/timelines/[id]/check-status` para verificar
4. Se necessário, publique manualmente via `/api/timelines/[id]/publish`

## 🧪 Testar em Sandbox

Em sandbox/localhost:

1. **O webhook pode não funcionar** (localhost não é acessível externamente)
2. **Solução:** Use verificação manual:
   - Após pagar, acesse `/api/timelines/[timelineId]/check-status`
   - Se o payment estiver `succeeded`, publique manualmente:
     ```bash
     POST /api/timelines/[timelineId]/publish
     ```

## 📝 Próximos Passos

Após o pagamento ser processado:

1. ✅ Timeline é publicada automaticamente
2. ✅ Usuário vê página de sucesso com links
3. ⏳ **TODO:** Enviar email com links (ainda não implementado)
4. ✅ Usuário pode acessar `/edit?token=...` para editar
5. ✅ Usuário pode compartilhar `/${slug}` publicamente

