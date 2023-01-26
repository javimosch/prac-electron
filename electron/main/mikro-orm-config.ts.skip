import { Options } from '@mikro-orm/core';

import { EntitySchema, Cascade, Collection, Entity, OneToMany, Property, ManyToOne, OptionalProps } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity'
 
/**
 * @property {number} id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string} name
 * @property {string} email
 * @property {number} age
 * @property {boolean} termsAccepted
 * @property {string[]} identities
 * @property {Date} born
 * @property {Collection<Book>} books
 * @property {Book} favouriteBook
 * @property {number} version
 * @property {string} versionAsString
 */
class Author extends BaseEntity {

  /**
   * @param {string} name
   * @param {string} email
   */
  constructor(name, email) {
    super();
    this.name = name;
    this.email = email;
    this.books = new Collection(this);
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.termsAccepted = false;
  }

}

export const schema = new EntitySchema({
  class: Author,
  properties: {
    name: { type: 'string' },
    email: { type: 'string', unique: true },
    age: { type: 'number', nullable: true },
    termsAccepted: { type: 'boolean', default: 0, onCreate: () => false },
    identities: { type: 'string[]', nullable: true },
    version: { type: 'number', persist: false },
  },
});

const config: Options = {
  entities: [Author], // no need for `entitiesTs` this way
  dbName: 'prak',
  type: 'sqlite',
  logger: (message: string) => console.log('MIKRO-LOG',message), // defaults to `console.log()`
  debug: true, // or provide array like `['query', 'query-params']`
};

export default config;