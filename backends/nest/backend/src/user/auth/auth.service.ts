// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityRepository, t } from '@mikro-orm/postgresql';
import { User } from '../entities/user.entity';
import {verifyPassword,hashPassword} from '../../libs/password';
import { UserRole,Provider } from '../entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserLoginResponse } from '../interfaces/user';
import { Verify } from '../entities/verify.entity';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: EntityRepository<User>,
              @InjectRepository(Verify) private readonly verifyRepository: EntityRepository<Verify>,
              private readonly mailService: MailService) {}

  async validateUser(email: string, password: string) : Promise<UserLoginResponse> {
    console.log("Validating user:", email);
    const user = await this.userRepository.findOne({ email });
    console.log(user)
    if (!user){
      const newuser = this.userRepository.create({
        email,
        firstName: "",
        lastName: "",
        verified: false,
        userRole: UserRole.USER,
        account: {
          provider: Provider.EMAIL,
          password: await hashPassword(password),
        },
      });
      await this.userRepository.getEntityManager().persistAndFlush(newuser);
      return {message: "User registered successfully",email: newuser.email,verified:false,allowed:true,id:newuser.id};
    }
    if (user){
      if (user.verified === false){

        return {message: "Please verify your email before logging in",email: user.email,verified:false,allowed:true,id:user.id};
      }
      if (user.account.provider !== Provider.EMAIL){
        return {message: `Please log in with ${user.account.provider} `,email: user.email,allowed:false,id:user.id};
      }
      else {
        const isMatch = await verifyPassword(user.account.password!, password);
        if (!isMatch) {
          return {message: "Invalid login credentials",email: user.email,allowed:true,id:user.id};
        }
        return {message:"verified successfully",email: user.email,allowed:true,verified:true,id:user.id};
      }
    }
    return {message: "Invalid login credentials",email: email,allowed:true,id:"" };
  }

  async validateGoogleUser(profile: any): Promise<User> {
    const email = profile.emails[0].value;
    let user = await this.userRepository.findOne({ email });

    if (!user) {
      user = this.userRepository.create({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email,
        verified: true,
        userRole: UserRole.USER,
        account: {
          provider: Provider.GOOGLE,
          providerAccountId: profile.id,
        },
      });
      await this.userRepository.getEntityManager().persistAndFlush(user);
    }

    return user;
  }

  async register(email: string, password: string,) {
    const existing = await this.userRepository.findOne({ email });
    if (existing) throw new UnauthorizedException('Email already registered');
    const hashed = await hashPassword(password);
    const user = this.userRepository.create({
      email,
      firstName: "",
      lastName: "",
      verified: false,
      userRole: UserRole.USER,
      account: {
        provider: Provider.EMAIL,
        password: hashed,
      },
    });
    await this.userRepository.getEntityManager().persistAndFlush(user);
    return user;
  }
  async validateVerificationCode(id: string, code: string): Promise<boolean> {
    const verifyEntry = await this.verifyRepository.findOne({ userId: id });
    if (verifyEntry && verifyEntry.code === code) {
      console.log("Verification successful");
      const user = await this.userRepository.findOne({ id: verifyEntry.userId });
      if (user) {
        user.verified = true;
        await this.userRepository.getEntityManager().persistAndFlush(user);
        // Optionally, delete the verification entry
        await this.verifyRepository.getEntityManager().removeAndFlush(verifyEntry);
        return true;
      }
    }
    return false;
    
  }
  async generateVerificationCode(userId: string): Promise<Verify> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const existing = await this.verifyRepository.findOne({ userId });
    if (existing) {
     existing.code = code;
     await this.verifyRepository.getEntityManager().persistAndFlush(existing);
     return existing;
    }// 6-digit code
    const verifyEntry = this.verifyRepository.create({
      code,
      userId,
    });
    await this.verifyRepository.getEntityManager().persistAndFlush(verifyEntry);
    console.log()
    const user = await this.userRepository.findOne({ id: userId });
    if (user) {
      this.mailService.sendVerificationEmail(user.email, code);
    }
   console.log("hy2")
    return verifyEntry;
  }

}
