import { TokenType } from 'src/middlewares/auth'
import { UpdatedAt } from 'sequelize-typescript'
import User from 'src/database/user'
import { UserStatus } from 'src/database/models'
import { confirmJwtToken } from 'src/middlewares/auth/token'
import sequelize from 'src/database/database'

export enum VerifyTokenResult {
  ok = 'ok',
  fail = 'fail',
  expired = 'expired',
}

type Result = {
  result: VerifyTokenResult,
  accountId?: string | null
}

export const verifyTokenCheck = async (token: string): Promise<Result> => {
  const decoded: any = confirmJwtToken(token)
  console.log('------ ', { decoded })
  if (!decoded) return { result: VerifyTokenResult.fail, accountId: null }

  const { id, exp, err }: TokenType = decoded
  console.log('------ ', { id, exp, err })
  if (!id || !exp || err) return { result: VerifyTokenResult.fail, accountId: null }

  if (exp > Date.now())  return { result: VerifyTokenResult.expired, accountId: null }

  const db = sequelize.getRepository(User)
  const aliveUser = await db.findOne({ where: { id } })
  if (aliveUser) {
    return { result: VerifyTokenResult.ok, accountId: id }
  }

  console.error('TODO: block user')
  // const blockedUser: User = await db.findOne({ where: { id, status }})
  // console.log('------ ', {user: blockedUser?.id, })

  // if (!blockedUser) {
  //   // TODO: throw Error
  //   return { result: VerifyTokenResult.fail , accountId: null}
  // }

  console.error('TODO: db update')
  // db.update(blockedUser.accountId, {
  //   accountId: blockedUser.accountId,
  //   email: blockedUser.email,
  //   userStatus: UserStatus.alive
  // })
  // UserService.update
  return { result: VerifyTokenResult.ok, accountId: id }
}
