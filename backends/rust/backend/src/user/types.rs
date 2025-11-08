use std::collections::HashMap;
use reqwest::{Client, StatusCode};
use serde::Deserialize;
use regex::Regex;

#[allow(unused)]
#[derive(Debug, Deserialize)]
pub struct EmailValidationResponse {
    pub email: String,
    pub valid: bool,
    pub user: String,
    pub domain: String,
    pub role: bool,
    pub disposable: bool,
    pub free_email: bool,
    pub valid_mx: bool,
    pub mx: Option<String>,
    pub sub: bool,
    pub score: u8,
    pub inbox_exists: bool,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
    pub role: String,
}

impl LoginRequest {
    pub async fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();

        // ---------------- EMAIL BASIC VALIDATION ----------------
        let email_regex = Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").unwrap();
        if self.email.trim().is_empty() {
            errors.insert("email".to_string(), "Email is required.".to_string());
        } else if !email_regex.is_match(&self.email) {
            errors.insert("email".to_string(), "Invalid email format.".to_string());
        } else {
            // ---------------- EMAIL VALIDATION API CHECK ----------------
            let api_url = format!("https://easyemailapi.com/api/verify/{}", self.email);
            let client = Client::new();

            match client.get(&api_url).send().await {
                Ok(resp) => {
                    match resp.status() {
                        StatusCode::OK => {
                            match resp.json::<EmailValidationResponse>().await {
                                Ok(api_response) => {
                                    // Interpret validation fields properly
                                    if !api_response.valid_mx {
                                        errors.insert("email".to_string(), "Email has invalid MX record.".to_string());
                                    }
                                    if api_response.disposable {
                                        errors.insert("email".to_string(), "Disposable emails are not allowed.".to_string());
                                    }
                                    if !api_response.valid {
                                        errors.insert("email".to_string(), "Email address appears invalid.".to_string());
                                    }
                                }
                                Err(err) => {
                                    errors.insert("email".to_string(), format!(
                                        "Failed to parse validation API response: {}",
                                        err
                                    ));
                                }
                            }
                        }
                        StatusCode::NOT_FOUND => {
                            errors.insert("email".to_string(), "Email validation service not found (404).".to_string());
                        }
                        StatusCode::UNAUTHORIZED => {
                            errors.insert("email".to_string(), "Email validation service unauthorized (401).".to_string());
                        }
                        StatusCode::TOO_MANY_REQUESTS => {
                            errors.insert("email".to_string(), "Too many validation requests, please try again later.".to_string());
                        }
                        code => {
                            errors.insert("email".to_string(), format!(
                                "Email validation service returned unexpected status: {}",
                                code
                            ));
                        }
                    }
                }
                Err(err) => {
                    if err.is_timeout() {
                        errors.insert("email".to_string(), "Email validation request timed out.".to_string());
                    } else if err.is_connect() {
                        errors.insert("email".to_string(), "Failed to connect to email validation API.".to_string());
                    } else if err.is_decode() {
                        errors.insert("email".to_string(), "Received invalid response format from validation API.".to_string());
                    } else {
                        errors.insert("email".to_string(), format!("Unexpected error validating email: {}", err));
                    }
                }
            }
        }

        // ---------------- PASSWORD VALIDATION ----------------
        if self.password.trim().is_empty() {
            errors.insert("password".to_string(), "Password is required.".to_string());
        } else if self.password.len() < 6 {
            errors.insert("password".to_string(), "Password must be at least 6 characters.".to_string());
        } else {     
                let has_upper = self.password.chars().any(|c| c.is_ascii_uppercase());
                let has_lower = self.password.chars().any(|c| c.is_ascii_lowercase());
                let has_digit = self.password.chars().any(|c| c.is_ascii_digit());
                let has_special = self.password.chars().any(|c| r"@$!%*?&".contains(c));
                if !(has_upper && has_lower && has_digit && has_special) {
                     errors.insert(
                         "password".to_string(),
                         "Password must include uppercase, lowercase, digit, and special character.".to_string(),
                     );
                 }
           
        }

        // ---------------- ROLE VALIDATION ----------------
        if self.role.trim().is_empty() {
            errors.insert("role".to_string(), "Role is required.".to_string());
        } else if !matches!(self.role.as_str(), "student" | "instructor") {
            errors.insert("role".to_string(), "Invalid role specified.".to_string());
        }

        // ---------------- FINAL RESULT ----------------
        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

#[allow(unused)]
#[derive(Debug, Deserialize)]
pub struct VerifyEmailRequest {
    pub user_id: String,
    pub code: String,
}

#[allow(unused)]
impl VerifyEmailRequest {
    pub fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();

        if self.user_id.trim().is_empty() {
            errors.insert("userId".to_string(), "userId is required.".to_string());
        }

        if self.code.trim().is_empty() {
            errors.insert("code".to_string(), "Verification code is required.".to_string());
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}


use actix_web::{
    dev::Payload,
    error::ErrorBadRequest,
    web, Error, FromRequest, HttpRequest,
};
use futures::FutureExt;
use serde::de::DeserializeOwned;
use serde_json::json;
use std::future::Future;

pub struct ValidatedJson<T>(pub T);

impl<T> FromRequest for ValidatedJson<T>
where
    T: DeserializeOwned + 'static,
{
    type Error = Error;
    type Future = std::pin::Pin<Box<dyn Future<Output = Result<Self, Error>>>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {
        let fut = web::Json::<T>::from_request(req, payload);

        async move {
            match fut.await {
                Ok(data) => Ok(ValidatedJson(data.into_inner())),
                Err(err) => {
                    // Extract readable error message from serde or actix
                    let error_msg = err.to_string();

                    // Parse the missing field name if available
                    let details = if error_msg.contains("missing field") {
                        if let Some(field) = error_msg.split('`').nth(1) {
                            json!({ field: "Missing field" })
                        } else {
                            json!({})
                        }
                    } else {
                        json!({ "body": error_msg })
                    };

                    let error_json = json!({
                        "error": "Invalid request body",
                        "details": details
                    });

                    Err(ErrorBadRequest(error_json.to_string()))
                }
            }
        }
        .boxed_local()
    }
}
