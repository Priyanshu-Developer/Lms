// src/session/MikroOrmStore.ts
import { Session } from '../user/entities/session.entity';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { SessionStore } from '@fastify/session';

export class MikroOrmStore implements SessionStore {
  constructor(private readonly em: SqlEntityManager) {}

  async get(sid: string, callback: (err: any, session?: any) => void) {
    try {
      const repo = this.em.getRepository(Session);
      const session = await repo.findOne({ sid });
      if (!session) return callback(null);
      if (session.expiredAt < new Date()) {
        await this.em.removeAndFlush(session);
        return callback(null);
      }
      callback(null, session.sess);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid: string, sess: any, callback?: (err?: any) => void) {
    try {
      const repo = this.em.getRepository(Session);
      const expiredAt = new Date(Date.now() + (sess.cookie?.originalMaxAge || 86400000)); // 1 day default

      let existing = await repo.findOne({ sid });
      if (existing) {
        existing.sess = sess;
        existing.expiredAt = expiredAt;
      } else {
        existing = repo.create({ sid, sess, expiredAt });
        this.em.persist(existing);
      }
      await this.em.flush();
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      const fork = this.em.fork(); // isolate this operation
      const repo = fork.getRepository(Session);

      const session = await repo.findOne({ sid });
      if (session) {
        await fork.removeAndFlush(session); // ensure actual deletion
      }
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

}
