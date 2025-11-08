import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';

const envConfig   = ConfigModule.forRoot({
      isGlobal: true, // Makes env variables available globally
    })

const DataBaseConfig = MikroOrmModule.forRoot(
      mikroOrmConfig
);
@Module({
  imports: [UserModule,envConfig,DataBaseConfig],
  controllers: [],
  providers: [],
})
export class AppModule {}
