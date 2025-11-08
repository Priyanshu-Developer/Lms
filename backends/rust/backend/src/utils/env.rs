use once_cell::sync::Lazy;

#[allow(dead_code)]
pub struct Env {
    pub database_url: String,
    pub port: u16,
    pub jwt_secret: String,
    pub resend_api_key: String,
    pub resend_from_email: String,
}

impl Env {
    pub fn init() -> Self {
        dotenvy::dotenv().ok();
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let port = std::env::var("PORT")
            .unwrap_or_else(|_| "4000".to_string())
            .parse()
            .expect("PORT must be a valid u16");
        let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let resend_api_key = std::env::var("RESEND_API_KEY").expect("RESEND_API_KEY must be set");
        let resend_from_email = std::env::var("RESEND_FROM_EMAIL").expect("RESEND_FROM_EMAIL not set").to_string();

        Env {
            database_url,
            port,
            jwt_secret,
            resend_api_key,
            resend_from_email,
        }
    }
}

pub static CONFIG: Lazy<Env> = Lazy::new(|| Env::init());
