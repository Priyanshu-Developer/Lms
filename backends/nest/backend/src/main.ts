
import { NestFactory } from '@nestjs/core';
import {FastifyAdapter,NestFastifyApplication} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import { fastifyCookie } from '@fastify/cookie';
import fastifyPassport from '@fastify/passport';
import { MikroORM } from '@mikro-orm/core';
import fastifySession from '@fastify/session';
import { MikroOrmStore } from './libs/mikro-orm.store';
import { SqlEntityManager } from '@mikro-orm/postgresql';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger:true}),
  );

  await app.register(fastifyCookie);
  const orm = app.get(MikroORM);
  const em = orm.em.fork() as SqlEntityManager;

  await app.register(fastifySession, {
    secret: process.env.SESSION_SECRET ?? 'dev-session-secret',
    cookie: {
      secure: false, // set true if using HTTPS
      maxAge: 86400000, // 1 day
    },
    store: new MikroOrmStore(em),
  });

  app.enableCors({
    origin: ['http://localhost:3000'], // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // if using cookies or Authorization headers
  });


  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());

  fastifyPassport.registerUserSerializer(async (user) => user);
  fastifyPassport.registerUserDeserializer(async (user) => user);
app.setGlobalPrefix('api');

const fastifyInstance = (app.getHttpAdapter() as FastifyAdapter).getInstance();
fastifyInstance.addHook('preHandler', (req, reply, done) => {
  console.log('Session ID:', req.session?.sessionId);
  console.log('Cookies:', req.cookies);
  done();
});

await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();