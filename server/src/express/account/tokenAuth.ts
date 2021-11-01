import { AuthToken, AuthTokenResult, GuestPrefix, TokenType } from 'src/middlewares/auth'

/* eslint-disable no-inner-declarations */
import { Configs } from 'config/serverenv'
import User from 'src/database/user'
import { UserStatus } from 'src/database/models'
import { confirmJwtToken } from 'src/middlewares/auth/token'
import sequelize from 'src/database/database'

export async function tokenSignin(req: any, res: any) {
  const { token } = req.query
  try {
    const db = sequelize.getRepository(User)
    const decoded: any = confirmJwtToken(token)
    if (decoded) {
      const { id, exp, err }: TokenType = decoded
      if (!id || !exp || err) res.send({ result: AuthTokenResult.invalidToken })

      const user = await db.findOne({ where: { accountId: id } })
      if (!user) res.send({ result: AuthTokenResult.userNotFound })
      console.log({ 'token authenticated': id })
      res.send({ result: AuthTokenResult.authenticated, id: user.id })
    } else {
      res.send({ result: AuthTokenResult.invalidToken })
    }
  } catch (e) {
    console.log('generate token Error: ', e)
    res.send({ result: AuthTokenResult.invalidToken })
  }
}

// import uuid from 'short-uuid'
// const short = uuid()
// const flowernames = require('flower-names')
// export async function tokenSignin(req: any, res: any) {
//   const { token } = req.query
//   // res.end('ok' + token)
//   try {
//     const db = sequelize.getRepository(User)
//     console.log({ tokenFromBrowser: token })

//     // 1. check token from front
//     // let authResult: AuthToken = { result: AuthTokenResult.invalidToken }
//     // if (token) {
//     //   authResult = await tokenAuthentication(token)
//     // }
//     const decoded: any = confirmJwtToken(token)
//     const { id, exp, err }: TokenType = decoded
//     if (!id || !exp || err) res.send({ result: AuthTokenResult.invalidToken })

//     // console.log('tokenSignin:', { authResult })

//     // 2. create token for enterence user
//     // if (Configs.ENABLE_GUEST_AUTO_LOGIN) {
//     //   if (authResult.result !== AuthTokenResult.authenticated) {
//     //     // isGuestAccount
//     //     const guestId = GuestPrefix + short.generate()
//     //     const user = await db.create({
//     //       accountId: guestId,
//     //       email: guestId,
//     //       firstName: flowernames.random() + ' (Guest)',
//     //       userState: UserStatus.visitor,
//     //     })
//     //     authResult.token = generateGuestToken(guestId)
//     //     authResult.result = AuthTokenResult.authenticated
//     //     authResult.accountId = guestId
//     //     // console.log({ token_generated: authResult })
//     //   }
//     // }
//     // console.log('authResult:', {authResult})

//     // const today = Date.now()
//     const user = await db.findOne({ where: { accountId: id } })
//     if (!user) res.send({ result: AuthTokenResult.userNotFound })
//     res.send(user)
//   } catch (e) {
//     console.log('generate token Error: ', e)
//     res.send({ result: AuthTokenResult.invalidToken })
//   }
// }
