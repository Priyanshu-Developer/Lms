
use resend_rs::Resend;

use crate::utils::env::CONFIG;

#[derive(Clone)]
pub struct EmailClient{
    pub client:Resend,
}
impl EmailClient {
    pub fn init() -> Self {
        let client = Resend::new(&CONFIG.resend_api_key);
        EmailClient { client }
    }
}