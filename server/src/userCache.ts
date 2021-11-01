import User from './database/user'
import { accountIdFromToken } from './middlewares/auth/token'
import sequelize from './database/database'

// user cache for token
type UserCache = {
  [key: string]: User
}
const accountIdCache: UserCache = {}
const userIdCache: UserCache = {}

export async function findUser(token: string) {
  const accountId = token ? accountIdFromToken(token) : null
  // find accountId from accountIdCache and update it
  let user: User | null = null
  if (accountId) {
    user = accountIdCache[accountId]
    if (!user) {
      user = await sequelize.getRepository(User).findOne({ where: { accountId } })
      if (user) accountIdCache[accountId] = user
    }
  }
  return user
}

export async function findUserById(userId: string) {
  // find accountId from userCache and update it
  let user: User | null = null
  user = userIdCache[userId]
  if (!user) {
    user = await sequelize.getRepository(User).findOne({ where: { id: userId } })
    if (user) userIdCache[userId] = user
  }
  return user
}
