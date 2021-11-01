import { PubSubEngine } from 'graphql-subscriptions'
import { Sequelize } from 'sequelize-typescript'
import User from './database/user'

export type Context = {
  db: Sequelize,
  userId: string,
  user: User
  pubsub: PubSubEngine
}
