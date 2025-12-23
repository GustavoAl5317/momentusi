/**
 * Função para enviar email de confirmação de pagamento
 * com os links da timeline e instruções de uso
 */

interface PaymentConfirmationEmailParams {
  to: string
  timelineTitle: string
  timelineSubtitle?: string
  publicUrl: string
  editUrl: string
  planType: 'essential' | 'complete'
}

export async function sendPaymentConfirmationEmail({
  to,
  timelineTitle,
  timelineSubtitle,
  publicUrl,
  editUrl,
  planType,
}: PaymentConfirmationEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY não configurado - email não será enviado')
      return {
        success: false,
        error: 'RESEND_API_KEY não configurado',
      }
    }

    // Usar domínio de teste do Resend se não tiver email comercial
    // Domínio de teste: onboarding@resend.dev (não precisa verificar domínio)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Momentusi <onboarding@resend.dev>'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momentusi.vercel.app'

    const html = generatePaymentConfirmationHTML({
      timelineTitle,
      timelineSubtitle,
      publicUrl,
      editUrl,
      planType,
      siteUrl,
    })

    const text = generatePaymentConfirmationText({
      timelineTitle,
      publicUrl,
      editUrl,
      planType,
    })

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: `🎉 Pagamento Aprovado! Sua Timeline "${timelineTitle}" está pronta`,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Erro ao enviar email via Resend:', error)
      return {
        success: false,
        error: error.message || 'Erro ao enviar email',
      }
    }

    const data = await response.json()
    console.log('✅ Email de confirmação enviado com sucesso:', data.id)
    return {
      success: true,
      messageId: data.id,
    }
  } catch (error: any) {
    console.error('Erro ao enviar email de confirmação:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
    }
  }
}

function generatePaymentConfirmationHTML({
  timelineTitle,
  timelineSubtitle,
  publicUrl,
  editUrl,
  planType,
  siteUrl,
}: {
  timelineTitle: string
  timelineSubtitle?: string
  publicUrl: string
  editUrl: string
  planType: 'essential' | 'complete'
  siteUrl: string
}): string {
  const planName = planType === 'complete' ? 'Completo' : 'Essencial'
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento Aprovado - Momentusi</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎉 Pagamento Aprovado!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Parabéns! Seu pagamento foi aprovado e sua timeline <strong>"${timelineTitle}"</strong> está pronta para ser compartilhada.
              </p>
              
              ${timelineSubtitle ? `
              <p style="margin: 0 0 30px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                ${timelineSubtitle}
              </p>
              ` : ''}
              
              <div style="background-color: #f9fafb; border-left: 4px solid #9333ea; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px; color: #374151; font-size: 14px; font-weight: 600;">
                  📋 Plano: ${planName}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Sua timeline está ativa e pronta para compartilhar com quem você quiser!
                </p>
              </div>
              
              <!-- Links -->
              <div style="margin: 40px 0;">
                <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; font-weight: 600;">
                  🔗 Seus Links
                </h2>
                
                <!-- Link Público -->
                <div style="margin-bottom: 20px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 2px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #374151; font-size: 14px; font-weight: 600;">
                    🌐 Link Público (Para Compartilhar)
                  </p>
                  <p style="margin: 0 0 15px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                    Use este link para compartilhar sua timeline com outras pessoas. Elas poderão ver todos os momentos que você criou.
                  </p>
                  <a href="${publicUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    Abrir Timeline Pública
                  </a>
                  <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; word-break: break-all;">
                    ${publicUrl}
                  </p>
                </div>
                
                <!-- Link de Edição -->
                <div style="margin-bottom: 20px; padding: 20px; background-color: #fef3c7; border-radius: 8px; border: 2px solid #fde68a;">
                  <p style="margin: 0 0 10px; color: #374151; font-size: 14px; font-weight: 600;">
                    ✏️ Link de Edição (Privado)
                  </p>
                  <p style="margin: 0 0 15px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                    <strong>⚠️ Guarde este link com cuidado!</strong> Use-o para editar sua timeline, adicionar ou remover momentos, mudar o tema, etc. Não compartilhe este link com outras pessoas.
                  </p>
                  <a href="${editUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    Editar Timeline
                  </a>
                  <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; word-break: break-all;">
                    ${editUrl}
                  </p>
                </div>
              </div>
              
              <!-- Instruções -->
              <div style="margin: 40px 0; padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px; font-weight: 600;">
                  📖 Como Usar
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                  <li style="margin-bottom: 10px;">
                    <strong>Compartilhar:</strong> Use o link público para compartilhar sua timeline em redes sociais, WhatsApp, ou por email.
                  </li>
                  <li style="margin-bottom: 10px;">
                    <strong>Editar:</strong> Use o link de edição para fazer alterações na sua timeline a qualquer momento.
                  </li>
                  <li style="margin-bottom: 10px;">
                    <strong>Personalizar:</strong> Você pode mudar o tema, layout, adicionar ou remover momentos quando quiser.
                  </li>
                  <li>
                    <strong>Privacidade:</strong> Se configurou senha, apenas quem tiver a senha poderá acessar sua timeline.
                  </li>
                </ul>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                  Precisa de ajuda? Entre em contato conosco:
                </p>
                <p style="margin: 0; color: #9333ea; font-size: 14px;">
                  <a href="mailto:gsantana.dev@hotmail.com" style="color: #9333ea; text-decoration: none;">gsantana.dev@hotmail.com</a>
                </p>
                <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Momentusi. Todos os direitos reservados.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

function generatePaymentConfirmationText({
  timelineTitle,
  publicUrl,
  editUrl,
  planType,
}: {
  timelineTitle: string
  publicUrl: string
  editUrl: string
  planType: 'essential' | 'complete'
}): string {
  const planName = planType === 'complete' ? 'Completo' : 'Essencial'
  
  return `
🎉 Pagamento Aprovado!

Parabéns! Seu pagamento foi aprovado e sua timeline "${timelineTitle}" está pronta para ser compartilhada.

📋 Plano: ${planName}
Sua timeline está ativa e pronta para compartilhar com quem você quiser!

🔗 Seus Links

🌐 Link Público (Para Compartilhar)
Use este link para compartilhar sua timeline com outras pessoas. Elas poderão ver todos os momentos que você criou.
${publicUrl}

✏️ Link de Edição (Privado)
⚠️ Guarde este link com cuidado! Use-o para editar sua timeline, adicionar ou remover momentos, mudar o tema, etc. Não compartilhe este link com outras pessoas.
${editUrl}

📖 Como Usar

• Compartilhar: Use o link público para compartilhar sua timeline em redes sociais, WhatsApp, ou por email.
• Editar: Use o link de edição para fazer alterações na sua timeline a qualquer momento.
• Personalizar: Você pode mudar o tema, layout, adicionar ou remover momentos quando quiser.
• Privacidade: Se configurou senha, apenas quem tiver a senha poderá acessar sua timeline.

Precisa de ajuda? Entre em contato conosco:
gsantana.dev@hotmail.com

© ${new Date().getFullYear()} Momentusi. Todos os direitos reservados.
  `.trim()
}

