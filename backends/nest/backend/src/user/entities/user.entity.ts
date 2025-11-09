import { BeforeCreate, Embeddable, Embedded, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Collection } from "@mikro-orm/core";
import { Session } from "./session.entity";


export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  INSTRUCTOR = 'instructor',
}
export enum Provider{
  EMAIL = 'email',
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
}



@Embeddable()
class Account {
  @Property({type:'string',nullable:false})
  provider!: Provider;

  @Property({type:'string',nullable:true})
  providerAccountId?: string;

 
  @Property({type:'string',nullable:true})
  password?: string;

}

@Entity()
export class User {
  @Property({type:'string', primary: true })
  id!: string;

  @Property({type:'string',nullable:false})
  firstName!: string;

  @Property({type:'string'})
  lastName!: string;

  @Property({type:'string', unique: true,nullable:false})
  email!: string;

  @Property({type:'boolean',default:false})
  verified!: boolean;

  @Property({type:'string',nullable:true})
  avatarUrl?: string;

  @Property({type:'string',nullable:false})
  userRole!: UserRole;

  @Embedded(() => Account)
  account!: Account;

 @BeforeCreate()
  generateId() {
    this.id = 'usr_' + Math.random().toString(36).slice(2, 11);
  }
  
  
}