// src/session/MikroOrmStore.ts
import { Session } from '../user/entities/session.entity';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { SessionStore } from '@fastify/session';

export class MikroOrmStore implements SessionStore {
  constructor(private readonly em: SqlEntityManager) {}

  async get(sid: string, callback: (err: any, session?: any) => void) {
    try {
      const fork = this.em.fork();
      const repo = fork.getRepository(Session);
      const record = await repo.findOne({ sid });

      if (!record) return callback(null);

      // Check expiration with 5s tolerance
      if (record.expiredAt.getTime() <= Date.now() - 5000) {
        await fork.removeAndFlush(record);
        return callback(null);
      }

      return callback(null, record.sess);
    } catch (err) {
      return callback(err);
    }
  }

  async set(sid: string, sess: any, callback?: (err?: any) => void) {
    try {
      const fork = this.em.fork();
      const repo = fork.getRepository(Session);

      const expiredAt = new Date(
        Date.now() + (sess?.cookie?.originalMaxAge ?? 86400000)
      );

      let record = await repo.findOne({ sid });

      if (record) {
        record.sess = sess;
        record.expiredAt = expiredAt;
        await fork.flush();
        console.log(`🔁 Updated session: ${sid}`);
      } else {
        record = fork.create(Session, { sid, sess, expiredAt });
        await fork.persistAndFlush(record);
        console.log(`🆕 Created new session: ${sid}`);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      const fork = this.em.fork();
      const repo = fork.getRepository(Session);
      const record = await repo.findOne({ sid });

      if (record) {
        await fork.removeAndFlush(record);
        console.log(`🗑️  Deleted session: ${sid}`);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }
}
