mod utils;
mod user;
mod entities;
mod email;

use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpResponse, HttpServer};
use colored::*;
use sea_orm::{Database, DatabaseConnection};
use std::env;
use crate::user::user_routes;
use crate::email::client::EmailClient;

use crate::utils::env::CONFIG;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub email:EmailClient,
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    unsafe { env::set_var("RUST_LOG", "actix_web=info"); }
    env_logger::init();
    println!("{}", "[+] Starting backend server...".bright_green().bold());

    // ✅ Initialize DB connection once
    let db = Database::connect(CONFIG.database_url.as_str())
        .await
        .expect("Failed to connect to database");

    let email_client = EmailClient::init();
    let appstate = AppState { db, email: email_client };

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allow_any_header()
            .allow_any_method()
            .max_age(3600)
            .supports_credentials();

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .service(
                web::scope("/api")
                    .route("/hello", web::get().to(|| async {
                        HttpResponse::Ok().body("Backend server is running!")
                    }))
                    .service(user_routes())
            )
            .app_data(web::Data::new(appstate.clone()))
    })
        .bind(("0.0.0.0", CONFIG.port))?
        .run()
        .await
}
