import { Injectable } from "@nestjs/common";
import fastifyPassport from '@fastify/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleAuthStrategy {
  constructor() {
    // Register Google OAuth Strategy
    fastifyPassport.use(
      'google',
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_CALLBACK_URL!,
          scope: ['email', 'profile'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = {
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value,
              photos: profile.photos?.[0]?.value,
            };
            done(null, user);
          } catch (err) {
            done(null, false);
          }
        },
      ),
    );

    // ✅ Correct way to register serializers/deserializers
    fastifyPassport.registerUserSerializer(async (user: any) => {
      return user; // must RETURN, not just reference
    });

    fastifyPassport.registerUserDeserializer(async (user: any) => {
      return user; // must RETURN
    });
  }
}
