import { AuthTokenResult, tokenAuthentication } from '.'

import { UserService } from 'src/database'
import { initDatabase } from 'src/database/database'

describe('signUp', () => {
  beforeAll(async () => {
    await initDatabase()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('success', async () => {
    try {
      // const labels: MailLabel[] = await getLabels(token)
      // console.log(token)
      const localToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imdzc2lzYWFjQGdtYWlsLmNvbSIsImlhdCI6MTYwMTg5MTQzMSwiZXhwIjoxNjA0NDgzNDMxLCJpc3MiOiJmYWIiLCJzdWIiOiJsb2dpbl91c2VyIn0.JbTNkxYdJ5ATq0kpsswbND34Bk8PdIf7nWsxQRqqySU'
      const { result, accountId, token } = await tokenAuthentication(localToken)

      expect(result).toBe(AuthTokenResult.userNotFound)

      // expect(signUpResult).not.toBeNull()
    } catch (err) {
      throw err
    }
  })
})
