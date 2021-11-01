import { Credentials } from 'google-auth-library'
import { UserService } from 'src/database'
import { UserStatus } from 'src/database/models'
import fs from 'fs'
import { initDatabase } from 'src/database/database'

describe('signUp', () => {
  let token: Credentials

  beforeAll(async () => {
    await initDatabase()
    const TOKEN_PATH = 'config/googleToken.json'
    token = JSON.parse(fs.readFileSync(TOKEN_PATH).toString())
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('success', async () => {
    try {
      // const labels: MailLabel[] = await getLabels(token)
      console.log(token)

      const data = {
        email: 'gssisaac@gmail.com',
        given_name: 'Anorld',
        family_name: 'Swaltz',
        picture: 'pic',
      }
      const { email, given_name, family_name, picture } = data

      const user = await UserService.findByAccountId(email)
      expect(user).toBeNull()

      const signUpResult = await UserService.create({
        email,
        accountId: email,
        oauthToken: JSON.stringify(token),
        photo: picture,
        firstName: given_name,
        lastName: family_name,
      }, UserStatus.alive)
      expect(signUpResult).not.toBeNull()
    } catch (err) {
      throw err
    }
  })
})
