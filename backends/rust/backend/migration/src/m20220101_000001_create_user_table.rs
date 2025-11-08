use sea_orm_migration::{prelude::*, schema::*};
use crate::extension::postgres::Type;

#[allow(unused)]
#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager.create_type(
            Type::create()
                .as_enum("user_role")
                .values(["admin", "student", "instructor"])
                .to_owned()).await?;
        manager
                .create_table(
                    Table::create()
                        .table(User::Table)
                        .if_not_exists()
                        .col(string(User::Id).not_null().primary_key())
                        .col(string(User::Email).not_null().unique_key())
                        .col(boolean(User::EmailVerified).not_null().default(false))
                        .col(string_null(User::ProfileImage))
                        .col(string_null(User::FirstName))
                        .col(string_null(User::LastName))
                        .col(timestamp(User::CreatedAt).not_null().default(Expr::current_timestamp()))
                        .col(timestamp(User::UpdatedAt).not_null().default(Expr::current_timestamp()))
                        .col(enumeration(User::Role, "user_role", ["admin", "student", "instructor"]).not_null().default("student"))
                        .col(json_binary_null(User::Metadata))
                        .to_owned(),
                ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}

#[allow(unused)]
#[derive(DeriveIden)]
pub enum User {
    Table,
    Id,
    FirstName,
    LastName,
    Email,
    EmailVerified,
    ProfileImage,
    CreatedAt,
    UpdatedAt,
    Role,
    Metadata,

}
