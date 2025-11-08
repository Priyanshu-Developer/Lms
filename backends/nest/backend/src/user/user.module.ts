import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { GoogleAuthStrategy } from 'src/libs/strategy/GoogleStrategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { LocalStrategy } from 'src/libs/strategy/LocalStrategy';




@Module({
  imports: [MikroOrmModule.forFeature([User,Session])],
  controllers: [AuthController],
  providers: [AuthService,GoogleAuthStrategy,LocalStrategy]
})
export class UserModule {}
