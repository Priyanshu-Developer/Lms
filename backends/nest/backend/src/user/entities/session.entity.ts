// src/entities/session.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Session {
  @PrimaryKey()
  sid!: string; // session ID from cookie

  @Property({ type: 'json' })
  sess!: Record<string, any>; // actual session data

  @Property({ type: 'datetime' })
  expiredAt!: Date;
}
