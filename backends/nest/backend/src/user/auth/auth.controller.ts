import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fastifyPassport from '@fastify/passport';
import { LocalAuthGuard } from 'src/libs/guards/localauth.guard';
import { VerifyDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  async googleAuth(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const handler = fastifyPassport.authenticate('google', {
      scope: ['profile', 'email'],
    }) as unknown as (req: FastifyRequest, res: FastifyReply) => any;
    return handler(req, res);
  }

  @Get('google/redirect')
  async googleCallback(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const handler = fastifyPassport.authenticate('google', async (err, user, info) => {
      if (err) {
        console.error('Error:', err);
        return reply.redirect('/auth/failure');
      }

      if (!user) {
        console.log('No user found');
        return reply.redirect('/auth/failure');
      }

      // ✅ Log the actual user object
      console.log('Authenticated user:', user);

      // ✅ Save user in session (if you’re using session)
      await req.logIn(user);

      // ✅ Redirect to success route
      reply.redirect('/auth/success');
    });

    // call the handler with the Fastify instance as `this`
    return (handler as unknown as Function).call((req as any).server, req, reply);
  }

  @Get('success')
  authSuccess(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    console.log('Auth Success - User:', req.user);
    res.send({ message: 'Authentication Successful', user: req.user });
  }

  @Get('failure')
  authFailure(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    console.log('Authentication Failed');
    res.send({ message: 'Authentication Failed' });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
   const user = (req as any).user;
   console.log(user)
   if (!user.allowed) {
      return res.status(403).send({
        message: user.message,
        id: user.id,
        allowed: false,
        verified: user.verified,
      });
    }

    if (!user.verified) {
      console.log(user)
      await this.authService.generateVerificationCode(user.id);
      return res.status(401).send({
        message: user.message ,
        id: user.id,
        verified: false,
        allowed: true,
      });
    }

    // ✅ Store user in session
    await req.logIn(user);

    return res.send({
      message: user.message || 'Login successful',
      id: user.id,
      verified: true,
      allowed: true,
    });
  }

 @Post('logout')
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      // ⚡ Get the *raw* internal session ID (used in DB)
      const rawSid = req.session.sessionId
      console.log('Raw SID:', rawSid);

      if (!rawSid) {
        return res.status(400).send({ message: 'No active session found' });
      }
      await new Promise<void>((resolve, reject) => {
        req.sessionStore.destroy(rawSid, (err?: any) => {
          if (err) return reject(err);
          resolve();
        });
      });
      await req.session.destroy();
      res.clearCookie('sessionId');

      return res.status(200).send({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Logout error:', err);
      return res.status(500).send({ message: 'Failed to logout', error: err });
    }
  }

  
  @Post('verify')
  async verify(@Body() body: VerifyDto, @Res() res: FastifyReply) {
    console.log(body)
    const  result = await this.authService.validateVerificationCode(body.id, body.code);
    console.log(result)
    if (result) {
      return res.status(200).send({ message: 'Email verified successfully' });
    } else {
      return res.status(400).send({ message: 'Invalid verification code' });
    }
  }
}
