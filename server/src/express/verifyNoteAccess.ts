import User, { UserStatus } from 'src/database/user'

import NoteAccess from 'src/database/noteAccess'
import { generateJwtToken } from 'src/middlewares/auth/token'
import { generateUniqueUserID } from 'src/graphql/user'
import sequelize from 'src/database/database'

export async function verifyNoteAccess(req: any, res: any) {
  const { noteId, email } = req.query
  try {
    const db = sequelize

    // TODO: 임시
    // const noteAccess = await db.getRepository(NoteAccess).findOne({
    //   where: { noteId, email },
    // })
    // if (!noteAccess) {
    //   res.send({ result: 'denied' })
    // }
    // const verified = noteAccess

    const verified = true

    if (verified) {
      const user: User = await db.getRepository(User).findOne({ where: { email: email } })
      console.log('user:' + user?.id)
      if (!user) {
        const transaction = await sequelize.transaction()
        try {
          const id = await generateUniqueUserID(transaction)
          const token = generateJwtToken(email, '1m')
          const newUser = await db.getRepository(User).create({ id, accountId: email, password: 'need-to-reset', email, token, userStatus: UserStatus.visitor })
          await transaction.commit()
          res.send({ result: 'ok', userId: newUser.id, token })
        } catch (e) {
          await transaction.rollback()
          throw e
        }
        console.log('verfied and created', { noteId, email })
      } else if (user?.userStatus === UserStatus.visitor) {
        console.log('verfied', { noteId, email })
        const token = generateJwtToken(email, '1m')
        res.send({ result: 'ok', userId: user.id, token })
      } else {
        console.log('need-login', { noteId, email })
        // need to login
        res.send({ result: 'need-login' })
      }
    }
  } catch (e) {
    console.log('failed', { noteId, email })
    res.send({ result: 'failed' })
  }
}
