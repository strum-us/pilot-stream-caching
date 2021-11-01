import { Credentials } from 'google-auth-library'
import { UserService } from 'src/database'
import { UserStatus } from 'src/database/models'
// import { buildSignupFakeData } from './signupFakeData'
import fs from 'fs'
import { googleAuthScope } from 'config/serverenv'
import { initDatabase } from 'src/database/database'
import { initGooglePassport } from './googlePassport'
import passport from 'passport'

describe('signUp', () => {
  let token: Credentials

  beforeAll(async () => {
    await initDatabase()
    const TOKEN_PATH = 'config/googleToken.json'
    token = JSON.parse(fs.readFileSync(TOKEN_PATH).toString())
    initGooglePassport()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('success', async () => {
    try {
      // const labels: MailLabel[] = await getLabels(token)
      // console.log(token)

      passport.authenticate('google', {
        scope: googleAuthScope,
        accessType: 'offline',
        prompt: 'consent',
      })

      const oauthToken = JSON.stringify(token)
      console.log({ oauthToken })

      const profile = {
        email: 'gssisaac@gmail.com',
        given_name: 'Hello',
        family_name: 'Com',
        picture: 'pic',
      }
      const { email, given_name, family_name, picture } = profile

      // if have id

      const today = Date.now()
      const user = email && await UserService.findByAccountId(email)
      if (user) {
        await UserService.login(user.id, today)
      } else {
        const signUpResult = await UserService.create({
          email,
          accountId: email,
          oauthToken: oauthToken,
          photo: picture,
          firstName: given_name,
          lastName: family_name,
        }, UserStatus.alive)
        // await buildSignupFakeData(email)
        console.log({ signUpResult })
      }

      // expect(signUpResult).not.toBeNull()
    } catch (err) {
      throw err
    }
  })
})
