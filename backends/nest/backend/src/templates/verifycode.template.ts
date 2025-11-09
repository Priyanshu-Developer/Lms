

export default function VerifyCodeTemplate(code: string):string {
  return `<!-- verification-email.html -->
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Verify your account</title>

        <!-- Basic safe inline styles for most email clients -->
        <style>
          /* CLIENT-SAFE STYLES (kept minimal) */
          body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
          table { border-collapse:collapse !important; }
          img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
          /* General */
          body { margin:0; padding:0; width:100% !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color:#f4f6f8; color:#0f172a; }
          .container { width:100%; max-width:640px; margin:0 auto; }
          .card { background:#ffffff; border-radius:12px; padding:28px; box-shadow:0 6px 18px rgba(16,24,40,0.06); }
          .preheader { display:none !important; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden; mso-hide:all; }
          h1 { font-size:20px; margin:0 0 8px 0; color:#0f172a; }
          p { margin:0 0 16px 0; line-height:1.5; color:#475569; }
          .code-box { display:inline-block; padding:18px 22px; border-radius:8px; background:#0b1220; color:#fff; font-weight:700; font-size:22px; letter-spacing:4px; font-family: "Courier New", Courier, monospace; }
          .small { font-size:13px; color:#94a3b8; }
          .footer { font-size:12px; color:#94a3b8; padding-top:18px; }
          .button { display:inline-block; padding:10px 16px; border-radius:8px; text-decoration:none; background:#0b69ff; color:#ffffff; font-weight:600; }
          /* responsive tweaks */
          @media (max-width:480px) {
            .card { padding:20px; border-radius:10px; }
            .code-box { font-size:20px; padding:14px 18px; }
          }
        </style>
      </head>
      <body>
        <!-- Preheader: short summary shown in inbox preview -->
        <div class="preheader">Use this 6-digit code to verify your account. It expires in 10 minutes.</div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:28px 16px;">
              <table role="presentation" class="container" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="padding-bottom:18px;">
                    <!-- Logo (optional) -->
                    <img src="https://via.placeholder.com/120x28?text=Logo" alt="Your Company" width="120" style="display:block; border:0;"/>
                  </td>
                </tr>

                <tr>
                  <td class="card" role="article" aria-label="Verification code">
                    <h1>Verify your email</h1>
                    <p>Hi <strong><!-- {{name}} --></strong>,</p>
                    <p>Thanks for signing up! Use the verification code below to complete your registration. This code will expire in <strong><!-- {{expiry_minutes}} -->10 minutes</strong>.</p>

                    <!-- Verification code -->
                    <p style="margin:18px 0;">
                      <span class="code-box" aria-label="Your verification code" role="text">${code}</span>
                    </p>

                    <!-- Optional action or help -->
                    <p class="small">If you didn't request this, you can safely ignore this email. For help, reply to this email or contact our support.</p>

                    <!-- Optional button -->
                    <p style="margin-top:18px;">
                      <a href="<!-- {{support_url}} -->" class="button" target="_blank" rel="noopener">Get help</a>
                    </p>

                    <div class="footer" style="margin-top:20px;">
                      <p style="margin:0;">Cheers,<br/>The Your Company team</p>
                      <p style="margin-top:8px;">Your Company, 123 Example St, City</p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:18px;">
                    <p class="small" style="margin:0;">If you have trouble, copy and paste this code into the app: <strong><!-- {{code}} --></strong></p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:16px;">
                    <p class="small" style="margin:0;">© <!-- {{year}} -->2025 Your Company. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
`;
}