import { confirmJwtToken, generateJwtToken } from './token'

import User from 'src/database/user'
import sequelize from 'src/database/database'

// import { User } from '@protocols/graphql-types'
// import { UserService } from 'src/database'

// import { Auth } from '.'
// import { UserService } from 'src/database'

export let JWT_SECRET_KEY: string

export function setJwtSecretKey(key: string) {
  JWT_SECRET_KEY = key
}

export enum AuthTokenResult {
  authenticated = 'authenticated',
  signinRequired = 'signinRequired',
  invalidToken = 'invalidToken',
  userNotFound = 'userNotFound',
  expired = 'expired',
}

export type AuthToken = {
  result: AuthTokenResult
  token?: string
  user?: User
  accountId?: string
}

export type TokenType = {
  id: string
  exp: number
  err: any
}

export function isGuestAccount(id: string) {
  return id && id.startsWith && id.startsWith(GuestPrefix)
}

// 1. Yes; extend token expiration
// 2. NO; existed but expired, signinRequired
// 3. NO; No current user, invalid
// export const tokenAuthentication = async (token: string): Promise<AuthToken> => {
//   const decoded: any = confirmJwtToken(token)
//   if (!decoded) {
//     return {
//       result: AuthTokenResult.invalidToken,
//     }
//   }
//   const { id, exp, err }: TokenType = decoded
//   // console.log('token auth', { id, exp, err })
//   if (!id || !exp || err) {
//     return {
//       result: AuthTokenResult.invalidToken,
//     }
//   }
//   console.log({ tokenuser: id })

//   // b. guestuser, its ok
//   if (isGuestAccount(id)) {
//     const newToken = generateJwtToken(id)
//     return {
//       result: AuthTokenResult.authenticated,
//       token: newToken,
//       accountId: id,
//     }
//   }

//   // a. expired token, sign in request
//   if (exp > Date.now()) {
//     return {
//       result: AuthTokenResult.expired,
//     }
//   }

//   // const loginUser = await UserService.findByAccountId(id)
//   const loginUser = await sequelize.getRepository(User).findOne({ where: { id } })

//   // c. no user, invalidate it
//   if (!loginUser) {
//     return {
//       result: AuthTokenResult.userNotFound,
//     }
//   }

//   // await Auth.login(id)

//   // d. renew token for futuure
//   // const newToken = generateJwtToken(id)
//   return {
//     result: AuthTokenResult.authenticated,
//     token: token,
//     accountId: id,
//   }
// }

export const GuestPrefix = 'guest:'

export const generateGuestToken = (guestId: string) => {
  console.log('generateGuestToken 1', guestId)
  const token = generateJwtToken(guestId)
  console.log('generateGuestToken 2', token)
  // console.log({ token_generated: token })
  // console.log({ decoded: confirmJwtToken(token) })
  // const decoded: any = confirmJwtToken(token)
  return token
}
