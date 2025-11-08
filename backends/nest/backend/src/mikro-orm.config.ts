import { PostgreSqlDriver, Options } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations'; // 👈 import the migrator
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const config: Options = {
  entities: [path.join(process.cwd(), './dist/**/*.entity.js')],
  entitiesTs: [path.join(process.cwd(), './src/**/*.entity.ts')],
  driver: PostgreSqlDriver,

  dbName: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: 5432,

  charset: 'UTF8',

  driverOptions: {
    connection: {
    
      channelBinding: process.env.PGCHANNELBINDING || 'disable',
      connectTimeout: 10000,
      charset: 'UTF8',
      collation: 'en_US.utf8',
    },
  },

  migrations: {
    path: process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), './db/migrations')
      : path.join(process.cwd(), './db/localmigrations'),
  },

  extensions: [Migrator], // 👈 this line is required
};

export default config;
