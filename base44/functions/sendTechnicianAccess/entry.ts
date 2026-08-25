import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { email, name } = body || {};
    if (!email) return Response.json({ error: 'Email é obrigatório' }, { status: 400 });

    // 1. Invite user (creates platform account if not exists)
    try {
      const inviteRes = await base44.users.inviteUser(email, 'user');
      console.log('inviteUser result:', JSON.stringify(inviteRes));
    } catch (e) {
      // User may already exist — that's fine, continue
      console.log('inviteUser error (may already exist):', e.message);
    }

    // 2. Wait for the user to be fully created and propagated
    await new Promise((resolve) => setTimeout(resolve, 6000));

    // 3. Call reset-password-request API directly to send the official "create/reset password" email
    const appId = secrets.get("BASE44_APP_ID");
    try {
      const resetRes = await fetch(`https://base44.app/api/apps/${appId}/auth/reset-password-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const resetBody = await resetRes.text();
      console.log('reset-password-request status:', resetRes.status, 'body:', resetBody);
    } catch (e) {
      // Continue — the custom email below still goes out
      console.log('reset-password-request fetch error:', e.message);
    }

    // Small extra delay so the account is fully registered before sending the custom email
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 4. Send custom email with instructions and login link
    const tecnicoLoginUrl = `https://radiant-power-pulse.base44.app/tecnico/login`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1E2A47;">Olá ${name || 'Técnico'}!</h2>
        <p style="color: #333; font-size: 15px;">
          Você foi cadastrado como técnico da <strong>RA Energética</strong>.
        </p>
        <p style="color: #333; font-size: 15px;">
          Você deve ter recebido (ou vai receber em seguida) um e-mail com o título relacionado a
          <strong>"redefinição de senha"</strong>. Abra esse e-mail (verifique também o spam) e clique no link
          para <strong>criar e confirmar sua senha</strong>. Caso tenha recebido apenas o e-mail de convite,
          pode usar o link dele também para definir sua senha.
        </p>
        <p style="color: #333; font-size: 15px;">
          Após criar sua senha, volte aqui e acesse o portal do técnico:
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
        subject: 'RA Energética — Acesso ao Portal do Técnico',
        body: htmlBody
      });
      console.log('SendEmail result:', JSON.stringify(emailRes));
    } catch (e) {
      // Custom email is supplementary
      console.log('SendEmail error:', e.message);
    }

    return Response.json({
      success: true,
      message: 'Link de criação de senha enviado para ' + email,
      tecnicoLoginUrl
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}