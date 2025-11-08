use sea_orm_migration::prelude::*;
mod m20220101_000001_create_user_table;
mod m20251018_160007_create_accounts;
mod m20251018_160024_create_sessions;


#[async_std::main]
async fn main() {
    cli::run_cli(migration::Migrator).await;
}
