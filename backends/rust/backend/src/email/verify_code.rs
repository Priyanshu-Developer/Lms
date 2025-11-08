
use resend_rs::types::CreateEmailBaseOptions;

use crate::utils::env::CONFIG;

use super::client::EmailClient;


impl EmailClient{
  pub async fn send_verification_code(&self,to:String,name:String,code:String) -> Result<(), resend_rs::Error> {

  let body =   format!(
        r#"
        <html>
            <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
                <div style="max-width:500px; margin:auto; background:white; border-radius:10px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color:#4CAF50;">Hi {name},</h2>
                    <p style="font-size:16px;">Your verification code is:</p>
                    <div style="font-size:32px; font-weight:bold; letter-spacing:4px; margin:20px 0; text-align:center; color:#333;">
                        {code}
                    </div>
                    <p style="color:#666;">This code will expire in 10 minutes. Please do not share it with anyone.</p>
                    <hr style="border:none; border-top:1px solid #ddd;">
                    <p style="font-size:12px; color:#999; text-align:center;">If you didn’t request this, please ignore this email.</p>
                </div>
            </body>
        </html>
        "#
    );

    let email = CreateEmailBaseOptions::new(
        CONFIG.resend_from_email.clone(),
        vec![to], // Wrap 'to' in a vector
        "Your Verification Code".to_string()
    )
    .with_html(&body);

   self.client.emails.send(email).await.map(|_| ())
  }
}