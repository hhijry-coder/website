import { EmailMessage } from 'cloudflare:email';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Allow ALL origins — the worker is a public form endpoint with no sensitive data
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const formData = await request.formData();
      const name         = formData.get('name')         || 'Unknown';
      const email        = formData.get('email')        || '';
      const organization = formData.get('organization') || '';
      const phone        = formData.get('phone')        || '';
      const message      = formData.get('message')      || '';

      // Basic validation
      if (!email || !name || !message) {
        return new Response(
          JSON.stringify({ success: false, message: 'Missing required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
        );
      }

      const subjectText = organization
        ? `New Consultation Request from ${name} (${organization})`
        : `New Consultation Request from ${name}`;

      // RFC 2047 encoded subject for full Unicode support
      const encodedSubject = '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(subjectText))) + '?=';

      const htmlBody = `
<h2 style="color:#1a1a1a;">New Consultation Request — khibra.org</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
  <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #eee;width:130px;">Name</td><td style="padding:10px 8px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
  <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #eee;">Organization</td><td style="padding:10px 8px;border-bottom:1px solid #eee;">${escapeHtml(organization || '—')}</td></tr>
  <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:10px 8px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:10px 8px;border-bottom:1px solid #eee;">${escapeHtml(phone || 'Not provided')}</td></tr>
</table>
<h3 style="color:#1a1a1a;margin-top:24px;">Message</h3>
<p style="background:#f9f9f9;padding:16px;border-radius:6px;line-height:1.6;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
<hr style="margin-top:32px;border:none;border-top:1px solid #eee;">
<p style="color:#999;font-size:12px;">Submitted via khibra.org contact form</p>
`;

      const rawEmail = [
        'MIME-Version: 1.0',
        'From: Khibra Contact <noreply@khibra.org>',
        'To: isct.center@gmail.com',
        `Reply-To: ${email}`,
        `Subject: ${encodedSubject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlBody,
      ].join('\r\n');

      const emailMsg = new EmailMessage('noreply@khibra.org', 'isct.center@gmail.com', rawEmail);
      await env.SEB.send(emailMsg);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );

    } catch (error) {
      // Surface the real error message so it's visible in the browser console
      console.error('Worker email error:', error.message);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }
  },
};
