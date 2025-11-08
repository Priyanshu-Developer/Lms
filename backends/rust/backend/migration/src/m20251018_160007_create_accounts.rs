use sea_orm_migration::{prelude::*, schema::*};
use crate::extension::postgres::Type;
use crate::m20220101_000001_create_user_table::User;

#[allow(unused)]
#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.create_type(
            Type::create()
                .as_enum("provider_type")
                .values(["google","email",])
                .to_owned()).await?;
        manager
            .create_table(
                Table::create()
                    .table(Provider::Table)
                    .if_not_exists()
                    .col(string(Provider::Id).not_null().primary_key())
                    .col(enumeration(Provider::ProviderType,"provider_type",["google","email",]).not_null())
                    .col(string_null(Provider::ProviderId))
                    .col(string(Provider::UserId).not_null())
                    .col(string_null(Provider::AccessToken))
                    .col(string_null(Provider::RefreshToken))
                    .col(string_null(Provider::Password))
                    .col(timestamp(Provider::CreatedAt).not_null().default(Expr::current_timestamp()))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_account_user")
                            .from(Provider::Table, Provider::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            )
            .await

    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(Provider::Table).to_owned())
            .await
    }
}

#[allow(unused)]
#[derive(DeriveIden)]
enum Provider {
    Table,
    Id,
    ProviderType,
    ProviderId,
    UserId,
    AccessToken,
    RefreshToken,
    Password,
    CreatedAt,

}
