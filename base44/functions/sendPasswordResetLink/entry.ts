import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { email } = body || {};
    if (!email) return Response.json({ error: 'Email é obrigatório' }, { status: 400 });

    // 1. Call reset-password-request API directly to send the official reset email
    const appId = secrets.get("BASE44_APP_ID");
    let resetOk = false;
    try {
      const resetRes = await fetch(`https://base44.app/api/apps/${appId}/auth/reset-password-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      resetOk = resetRes.ok;
      const resetBody = await resetRes.text();
      console.log('reset-password-request status:', resetRes.status, 'body:', resetBody);
    } catch (e) {
      // Continue — the custom email below still goes out
      console.log('reset-password-request fetch error:', e.message);
    }

    // 2. Send custom email with instructions
    const tecnicoLoginUrl = `https://radiant-power-pulse.base44.app/tecnico/login`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1E2A47;">Recuperação de Senha</h2>
        <p style="color: #333; font-size: 15px;">
          Recebemos sua solicitação de recuperação de senha para acesso ao <strong>Portal do Técnico — RA Energética</strong>.
        </p>
        <p style="color: #333; font-size: 15px;">
          Enviamos um link oficial para você <strong>criar/redefinir sua senha</strong> (com confirmação).
          Verifique sua caixa de entrada e também a pasta de spam.
        </p>
        <p style="color: #333; font-size: 15px;">
          Após definir sua senha, acesse o portal do técnico:
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${tecnicoLoginUrl}" style="background: #1E2A47; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: bold;">
            Acessar Portal do Técnico
          </a>
        </p>
        <p style="color: #999; font-size: 13px;">
          Link direto: ${tecnicoLoginUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">
          RA Energética — Locações & Eventos
        </p>
      </div>
    `;

    try {
      const emailRes = await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: 'RA Energética — Recuperação de Senha',
        body: htmlBody
      });
      console.log('SendEmail result:', JSON.stringify(emailRes));
    } catch (e) {
      // Custom email is supplementary
      console.log('SendEmail error:', e.message);
    }

    return Response.json({
      success: true,
      message: 'Link de recuperação enviado para ' + email,
      tecnicoLoginUrl
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}