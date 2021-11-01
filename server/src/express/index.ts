import { Express } from 'express'
import { sendPublishMail } from './email'
import { tokenSignin } from './account/tokenAuth'
import { verifyNoteAccess } from './verifyNoteAccess'

export function initApis(app: Express) {
  app.post('/account/tokenSignin', tokenSignin)
  app.post('/mail/sendPublishMail', sendPublishMail)

  app.post('/verify/noteAccess', verifyNoteAccess)
}
