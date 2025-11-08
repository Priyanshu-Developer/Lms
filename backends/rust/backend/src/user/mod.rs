pub mod auth;
pub mod types;

use std::time::SystemTime;
use actix_web::Scope;
use bcrypt::{hash, verify, DEFAULT_COST};
use rand::Rng;


pub fn hash_password(plain: &str) -> Result<String, bcrypt::BcryptError> {
    hash(plain, DEFAULT_COST)
}
pub fn verify_password(plain: &str, hashed: &str) -> Result<bool, bcrypt::BcryptError> {
    verify(plain, hashed)
}
pub fn generate_user_id() -> String {
    let now = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs();
    return format!("{:X}", now);
}

pub fn create_verification(userid:String,code:String) -> crate::entities::verification::ActiveModel {
    crate::entities::verification::ActiveModel{
        user_id: sea_orm::ActiveValue::Set(userid),
        code: sea_orm::ActiveValue::Set(code),
        expires_at: sea_orm::ActiveValue::Set(
            {
                use chrono::{DateTime, Utc};
                let system_time = SystemTime::now()
                    .checked_add(std::time::Duration::new(600, 0))
                    .unwrap();
                let datetime: DateTime<Utc> = system_time.into();
                datetime.naive_utc()
            }
        ),        ..Default::default()
    }

}
pub fn generate_provider_id() -> String {
    let now = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs();
    return format!("{:X}", now);
}



pub fn generate_code(len: i32) -> String {
    let charset: Vec<char> = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".chars().collect();
    let mut rng = rand::rng();  // new API replacing thread_rng()

    (0..len)
        .map(|_| {
            let idx = rng.random_range(0..charset.len()); // gen_range() renamed to random_range()
            charset[idx]
        })
        .collect()
}


pub fn user_routes() -> Scope{
    actix_web::web::scope("/user")
        .service(auth::login)
        .service(auth::verify_email)
}