import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, timelineTitle, timelineSubtitle, timelineUrl } = body

    if (!to || !timelineTitle || !timelineUrl) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: to, timelineTitle, timelineUrl' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Usar Resend se configurado, senão usar fallback simples
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Usar Resend para envio de email
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Momenta <noreply@momenta.app>',
          to: [to],
          subject: `📅 ${timelineTitle} - Sua Timeline Momenta`,
          html: generateEmailHTML(timelineTitle, timelineSubtitle, timelineUrl),
          text: generateEmailText(timelineTitle, timelineSubtitle, timelineUrl),
        }),
      })

      if (!resendResponse.ok) {
        const error = await resendResponse.json()
        console.error('Erro ao enviar email via Resend:', error)
        return NextResponse.json(
          { error: 'Erro ao enviar email' },
          { status: 500 }
        )
      }

      const data = await resendResponse.json()
      return NextResponse.json({ 
        success: true, 
        messageId: data.id,
        message: 'Email enviado com sucesso' 
      })
    } else {
      // Fallback: apenas log (para desenvolvimento)
      console.log('📧 Email seria enviado:', {
        to,
        subject: `📅 ${timelineTitle} - Sua Timeline Momenta`,
        timelineUrl,
      })
      
      // Em produção, você deve configurar o RESEND_API_KEY
      return NextResponse.json({
        success: true,
        message: 'Email simulado (configure RESEND_API_KEY para envio real)',
        warning: 'RESEND_API_KEY não configurado',
      })
    }
  } catch (error) {
    console.error('Erro ao processar envio de email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function generateEmailHTML(
  title: string,
  subtitle: string | undefined,
  url: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📅 Momenta</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">${title}</h2>
          ${subtitle ? `<p style="color: #6b7280; font-size: 16px; margin-bottom: 30px;">${subtitle}</p>` : ''}
          
          <p style="color: #374151; font-size: 16px; margin-bottom: 30px;">
            Você recebeu uma timeline especial! Clique no botão abaixo para visualizar:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" 
               style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(236, 72, 153, 0.3);">
              Ver Timeline
            </a>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              <strong>Ou copie e cole este link no seu navegador:</strong>
            </p>
            <p style="color: #ec4899; font-size: 14px; word-break: break-all; margin: 0; font-family: monospace;">
              ${url}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            Este email foi enviado através do Momenta.<br>
            Se você não esperava receber este email, pode ignorá-lo com segurança.
          </p>
        </div>
      </body>
    </html>
  `
}

function generateEmailText(
  title: string,
  subtitle: string | undefined,
  url: string
): string {
  return `
📅 Momenta

${title}
${subtitle ? `${subtitle}\n` : ''}

Você recebeu uma timeline especial! Acesse o link abaixo para visualizar:

${url}

---
Este email foi enviado através do Momenta.
Se você não esperava receber este email, pode ignorá-lo com segurança.
  `.trim()
}

