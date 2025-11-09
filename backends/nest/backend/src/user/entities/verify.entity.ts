import { BeforeCreate, Entity, PrimaryKey, Property } from "@mikro-orm/core";


@Entity()
export class Verify {
  @PrimaryKey({ type: "string" })
  id!: string;

  @Property({type: "text",length: 6})
  code!: string;

  @Property({type: "text"})
  userId!: string;

  @BeforeCreate()
  generateId() {
    this.id = crypto.randomUUID();
  }
}