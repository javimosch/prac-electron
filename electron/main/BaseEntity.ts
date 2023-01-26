import { PrimaryKey, Property, Entity } from '@mikro-orm/core';

//@Entity()
export abstract class BaseEntity {

  //@PrimaryKey({type:'number'})
  id!: number;

  //@Property({type:Date})
  createdAt: Date = new Date();

  //@Property({ onUpdate: () => new Date(), type:Date })
  updatedAt: Date = new Date();

}