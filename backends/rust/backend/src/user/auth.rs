use std::str::FromStr;

use actix_web::{post, HttpResponse};
use actix_web::web::Data;
use sea_orm::{EntityTrait, ColumnTrait, QueryFilter, ActiveModelTrait};
use serde_json::json;
use crate::entities::user;
use crate::entities::provider;
use crate::user::generate_code;
use crate::user::types::{LoginRequest, VerifyEmailRequest};
use sea_orm::ActiveValue::Set;
use crate::AppState;
use crate::entities::sea_orm_active_enums::UserRole;
use crate::entities::verification;
use crate::entities::sea_orm_active_enums::ProviderType;
use super::types::ValidatedJson;
use super::{generate_user_id, generate_provider_id, hash_password, verify_password, create_verification};
#[post("/login")]
async fn login(body: ValidatedJson<LoginRequest>, app_state: Data<AppState>) -> HttpResponse {
    if let Err(errs) = body.0.validate().await {
        println!("Validation error: {:?}", errs);
        return HttpResponse::BadRequest().json(errs);
    }

    match user::Entity::find()
        .filter(crate::entities::user::Column::Email.eq(body.0.email.clone()))
        .one(&app_state.db)
        .await
    {
        Ok(Some(user)) => {
            if user.email_verified {
                let provider_result = provider::Entity::find()
                    .filter(provider::Column::UserId.eq(user.id.clone()))
                    .one(&app_state.db)
                    .await;

                match provider_result {
                    Ok(Some(provider)) => {
                        if provider.provider_type != crate::entities::sea_orm_active_enums::ProviderType::Email {
                            if provider.provider_type == crate::entities::sea_orm_active_enums::ProviderType::Google {
                                return HttpResponse::Unauthorized().json(json!({"error":"Please login using Google Sign-In"}));
                            }
                        }
                        match verify_password(&body.0.password, &provider.password.unwrap()) {
                            Ok(true) => HttpResponse::Ok().json(json!({"userId": user.id,"role": user.role})),
                            Ok(false) => {
                                println!("Invalid password attempt for user: {}", user.id);
                                HttpResponse::Unauthorized().json(json!({"error":"Invalid Credentials"}))
                            },
                            Err(err) => {
                                println!("Internal error during password verification: {:?}", err);
                                HttpResponse::InternalServerError().json(json!({"error":format!("Internal Server error: {}", err)}))
                            }
                        }
                    }
                    Ok(None) => {
                        println!("No provider found for user: {}", user.id);
                        HttpResponse::InternalServerError().json(json!({"error":"Authentication provider data missing"}))
                    }
                    Err(err) => {
                        println!("Database error fetching provider: {:?}", err);
                        HttpResponse::InternalServerError().json(json!({"error":"Internal Server Error"}))
                    }
                }
            } else {
                let code = generate_code(6);
                let verification = create_verification(user.id.clone(), code.clone());
                let c = verification.insert(&app_state.db.clone()).await;
                println!("Created verification entry: {:?}", c);
                match app_state.email.send_verification_code(user.email.clone(), user.email.clone(), code).await {
                    Ok(()) => HttpResponse::Ok().json(json!({"userId":user.id,"verify":true})),
                    Err(err) => {
                        println!("Error sending verification email: {:?}", err);
                        HttpResponse::InternalServerError().json(json!({"error": err.to_string()}))
                    }
                }
            }
        }
        Ok(None) => {
            match UserRole::from_str(body.0.role.as_str()) {
                Ok(role_val) => {
                    let user_res = user::ActiveModel {
                        id: Set(generate_user_id()),
                        email: Set(body.0.email.clone()),
                        first_name: Set(Some("".to_string())),
                        last_name: Set(Some("".to_string())),
                        email_verified: Set(false),
                        role: Set(role_val),
                        ..Default::default()
                    }.insert(&app_state.db).await;

                    match user_res {
                        Ok(user) => {
                            let hashed_password = hash_password(&body.0.password).unwrap();
                            let _provider_res = provider::ActiveModel {
                                id: Set(generate_provider_id()),
                                user_id: Set(user.id.clone()),
                                provider_type: Set(ProviderType::Email),
                                password: Set(Some(hashed_password)),
                                ..Default::default()
                            }.insert(&app_state.db.clone()).await;

                            let code = generate_code(6);
                            let verification = create_verification(user.id.clone(), code.clone());
                            let c = verification.insert(&app_state.db.clone()).await;
                            println!("Created verification entry: {:?}", c);
                            match app_state.email.send_verification_code(user.email.clone(), user.email.clone(), code).await {
                                Ok(()) => HttpResponse::Ok().json(json!({"userId":user.id,"verify":true})),
                                Err(err) => {
                                    println!("Error sending verification email: {:?}", err);
                                    HttpResponse::InternalServerError().json(json!({"error": err.to_string()}))
                                }
                            }
                        }
                        Err(err) => {
                            println!("Database error creating user: {:?}", err);
                            HttpResponse::InternalServerError().json(json!({"error":"Internal Server Error"}))
                        }
                    }
                }
                Err(_) => {
                    println!("Invalid role specified: {}", body.0.role);
                    HttpResponse::BadRequest().json(json!({"error":"Invalid role specified."}))
                }
            }
        }
        Err(err) => {
            println!("Database error fetching user: {:?}", err);
            HttpResponse::InternalServerError().json(json!({"error":"Internal Server Error"}))
        }
    }
}


#[post("/verify")]
async fn verify_email(body:ValidatedJson<VerifyEmailRequest>,app_state:Data<AppState>) -> HttpResponse {
    if let Err(errs) = body.0.validate() {
        println!("Verification validation error: {:?}", errs);
        return HttpResponse::BadRequest().json(errs);
    }

    match verification::Entity::find()
        .filter(verification::Column::UserId.eq(body.0.user_id.clone()))
        .filter(verification::Column::Code.eq(body.0.code.clone()))
        .one(&app_state.db)
        .await
    {
        Ok(Some(verify)) => {
            if verify.expires_at < chrono::Utc::now().naive_utc() {
                let mut verify_am: verification::ActiveModel = verify.into();
                let code = generate_code(6);
                verify_am.code = Set(code.clone());
                let _ = verify_am.update(&app_state.db).await;
                let user = user::Entity::find_by_id(body.0.user_id.clone())
                    .one(&app_state.db)
                    .await.unwrap().unwrap();
                app_state.email.send_verification_code(user.email.clone(), user.email, code).await.unwrap();
                return HttpResponse::BadRequest().json(json!({"error":"Verification code expired. A new code has been sent to your email."}));
            }
            let user_res = user::Entity::find_by_id(body.0.user_id.clone())
                .one(&app_state.db)
                .await;

            match user_res {
                Ok(Some(user)) => {
                
                    let mut user_am: user::ActiveModel = user.into();
                    user_am.email_verified = Set(true);
                    if let Err(err) = user_am.update(&app_state.db).await {
                        println!("Error updating user email_verified status: {:?}", err);
                        return HttpResponse::InternalServerError().json(json!({"error": "Internal Server Error"}));
                    }

                    let ver_am: verification::ActiveModel = verification::ActiveModel::from(verify);
                    if let Err(err) = verification::Entity::delete(ver_am).exec(&app_state.db).await {
                        println!("Error deleting verification code entry: {:?}", err);
                        return HttpResponse::InternalServerError().json(json!({"error": "Internal Server Error"}));
                    }

                    HttpResponse::Ok().json(json!({"message":"Email verified successfully."}))
                }
                Ok(None) => {
                    println!("User not found during email verification: {}", body.0.user_id);
                    HttpResponse::BadRequest().json(json!({"error":"User not found."}))
                }
                Err(err) => {
                    println!("Database error fetching user for verification: {:?}", err);
                    HttpResponse::InternalServerError().json(json!({"error":"Internal Server Error"}))
                }
            }
        }
        Ok(None) => {
            println!("Invalid verification code for user_id: {}", body.0.user_id);
            HttpResponse::BadRequest().json(json!({"error":"Invalid verification code."}))
        }
        Err(err) => {
            println!("Database error finding verification code: {:?}", err);
            HttpResponse::InternalServerError().json(json!({"error":"Internal Server Error"}))
        }
    }
}
