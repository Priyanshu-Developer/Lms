// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../user/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    console.log("ovoc")
    super({ usernameField: 'email' }); // using email instead of username
  }

  async validate(email: string, password: string) {
    return await this.authService.validateUser(email, password);
  }
}
