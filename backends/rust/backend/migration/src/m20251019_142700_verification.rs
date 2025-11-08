use sea_orm_migration::{prelude::*, schema::*};
use crate::m20220101_000001_create_user_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Verification::Table)
                    .if_not_exists()
                    .col(pk_auto(Verification::Id))
                    .col(string(Verification::UserId).not_null())  // ← This was missing!
                    .col(string(Verification::Code).not_null())
                    .col(timestamp(Verification::ExpiresAt).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Verification::Table, Verification::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                    )
                    .to_owned(),
            )
            .await?;

        // Add index for faster lookups
        manager
            .create_index(
                Index::create()
                    .name("idx_verification_user_id")
                    .table(Verification::Table)
                    .col(Verification::UserId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_verification_code")
                    .table(Verification::Table)
                    .col(Verification::Code)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Verification::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Verification {
    Table,
    Id,
    UserId,
    Code,
    ExpiresAt,
}