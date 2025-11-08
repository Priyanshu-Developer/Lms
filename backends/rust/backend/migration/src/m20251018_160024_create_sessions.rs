use sea_orm_migration::{prelude::*, schema::*};
use super::m20220101_000001_create_user_table::User;

#[allow(unused)]
#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(Session::Table)
                    .if_not_exists()
                    .col(pk_auto(Session::Id))
                    .col(string(Session::RefreshToken).not_null().unique_key())
                    .col(string(Session::AccessToken).not_null().unique_key())
                    .col(timestamp(Session::RefreshTokenExpiry).not_null())
                    .col(timestamp(Session::AccessTokenExpiry).not_null())
                    .col(timestamp(Session::CreateAt).not_null().default(Expr::current_timestamp()))
                    .col(timestamp(Session::ExpireAt).not_null())
                    .col(string(Session::IpAddress).not_null())
                    .col(string(Session::UserAgent).not_null())
                    .col(string(Session::UserId).not_null())
                    .foreign_key(ForeignKey::create().from(Session::Table,Session::UserId)
                        .to(User::Table,User::Id).on_delete(ForeignKeyAction::Cascade))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Session::Table).to_owned())
            .await
    }
}
#[allow(unused)]
#[derive(DeriveIden)]
pub enum Session {
    Table,
    Id,
    CreateAt,
    ExpireAt,
    RefreshToken,
    AccessToken,
    RefreshTokenExpiry,
    AccessTokenExpiry,
    IpAddress,
    UserAgent,
    UserId,
}
