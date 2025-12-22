# 🔧 Troubleshooting: Botões do Mercado Pago Não Funcionam

## Possíveis Causas e Soluções

### 1. ✅ Verificar Access Token

O Access Token do Mercado Pago pode estar incorreto ou expirado.

**Solução:**
1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Vá em **Suas integrações** > **Credenciais**
3. Verifique se está usando o **Access Token** correto:
   - **Teste (Sandbox)**: Use o token de teste
   - **Produção**: Use o token de produção
4. Atualize no `.env.local`:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
   ```
5. Reinicie o servidor

### 2. ✅ Verificar Ambiente (Sandbox vs Produção)

Se estiver em desenvolvimento, certifique-se de usar o token de **Sandbox**.

**Solução:**
- Em desenvolvimento, use o token de **teste**
- A URL retornada deve ser `sandbox_init_point`
- Verifique os logs no terminal para ver qual URL está sendo retornada

### 3. ✅ Verificar Valores Mínimos

O Mercado Pago tem valores mínimos para pagamentos.

**Solução:**
- Verifique se o valor está acima do mínimo (geralmente R$ 0,50)
- Os valores atuais são R$ 19,90 e R$ 39,90, então estão OK

### 4. ✅ Verificar Console do Navegador

Abra o console do navegador (F12) e verifique se há erros.

**Solução:**
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Procure por erros relacionados ao Mercado Pago
4. Compartilhe os erros para análise

### 5. ✅ Verificar Logs do Servidor

Verifique os logs no terminal onde o servidor está rodando.

**O que procurar:**
- `Preference criada:` - Deve mostrar o ID e as URLs
- `URL de checkout:` - Deve mostrar a URL gerada
- Erros relacionados ao Mercado Pago

### 6. ✅ Testar com Cartão de Teste

Use um cartão de teste do Mercado Pago.

**Cartões de Teste (Sandbox):**
- **Aprovado**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Data**: Qualquer data futura
- **Nome**: Qualquer nome

### 7. ✅ Verificar Configuração da Conta Mercado Pago

Certifique-se de que sua conta Mercado Pago está configurada corretamente.

**Verificar:**
1. Acesse [Mercado Pago](https://www.mercadopago.com.br)
2. Vá em **Seu negócio** > **Configurações**
3. Verifique se a conta está ativa
4. Verifique se há alguma restrição ou bloqueio

### 8. ✅ Verificar URLs de Retorno

As URLs de retorno devem ser acessíveis.

**Solução:**
- Em desenvolvimento (`localhost`), o Mercado Pago pode ter limitações
- Considere usar um túnel como [ngrok](https://ngrok.com) para testar webhooks
- Para produção, use um domínio válido

### 9. ✅ Limpar Cache e Cookies

Às vezes, cache ou cookies podem causar problemas.

**Solução:**
1. Limpe o cache do navegador
2. Limpe os cookies do Mercado Pago
3. Tente em uma janela anônima/privada

### 10. ✅ Verificar Network Tab

Verifique a aba Network no DevTools para ver as requisições.

**O que procurar:**
1. Abra DevTools (F12) > **Network**
2. Tente fazer o checkout novamente
3. Procure por requisições para `/api/checkout`
4. Verifique se a resposta contém `checkoutUrl`
5. Verifique se há erros 4xx ou 5xx

## 📝 Checklist Rápido

- [ ] Access Token está correto no `.env.local`
- [ ] Está usando token de Sandbox em desenvolvimento
- [ ] Servidor foi reiniciado após mudar variáveis
- [ ] Console do navegador não mostra erros
- [ ] Logs do servidor mostram preference criada
- [ ] URL de checkout está sendo retornada
- [ ] Tentou em janela anônima/privada
- [ ] Verificou Network tab para erros

## 🆘 Se Nada Funcionar

1. Compartilhe os logs completos do terminal
2. Compartilhe os erros do console do navegador
3. Compartilhe uma captura de tela da página do Mercado Pago
4. Verifique se o Access Token está funcionando testando diretamente na API do Mercado Pago

