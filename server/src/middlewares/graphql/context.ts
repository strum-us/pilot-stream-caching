import { PubSubEngine } from 'graphql-subscriptions'
import User from 'src/database/user'
// import User from 'src/database/user/model'
// import { sendServerErrorMail } from '@middlewares/emailSender'

export type GraphqlContext = {
  token: string
  accountId: string
  userId: number
  user: User
  pubsub: PubSubEngine
}
