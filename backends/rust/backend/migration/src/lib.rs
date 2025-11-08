pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_user_table;
mod m20251018_160007_create_accounts;
mod m20251018_160024_create_sessions;
mod m20251019_142700_verification;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_user_table::Migration),
            Box::new(m20251018_160007_create_accounts::Migration),
            Box::new(m20251018_160024_create_sessions::Migration),
            Box::new(m20251019_142700_verification::Migration),
        ]
    }
}
