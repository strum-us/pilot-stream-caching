import { JWT_SECRET_KEY } from '.'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const PASSWORD_SALT_ROUND = 10

// Token structure
// {
//   id: string
//   lat: number
//   exp: number
//   iss: string
//   sub: string
// }
export const generateJwtToken = (id: string, period?: string) => jwt.sign({ id: id }, JWT_SECRET_KEY, {
  expiresIn: period ?? '30d',
  issuer: 'strum.us',
  subject: 'login_user',
})

export const generateVerificationToken = (id: string) => jwt.sign({ id: id }, JWT_SECRET_KEY, {
  expiresIn: id ? '1d' : 60 * 5,
  issuer: 'strum.us',
  subject: 'login_user',
})

export const generateInvitationToken = (id: string) => jwt.sign({ id: id }, JWT_SECRET_KEY, {
  expiresIn: '1d',
  issuer: 'strum.us',
  subject: 'invitation_user',
})

export const generateInviteLinkToken = (id: string) => jwt.sign({ id: id }, JWT_SECRET_KEY, {
  expiresIn: '3h',
  issuer: 'strum.us',
  subject: 'invite_link',
})

type Token = {
  id: string
  lat: number
  exp: number
  iss: string
  sub: string
}

export const confirmJwtToken = (token: string): Token | null => {
  if (token === '') return null
  let result: Token | null = null
  try {
    result = jwt.verify(token, JWT_SECRET_KEY) as Token
  } catch (err) {
    // result = {
    //   err: err,
    // }
    // console.log('confirmJwtToken', { token, err })
    result = null
  }
  return result
}

export function accountIdFromToken(token: string) {
  const confirmToken = confirmJwtToken(token)
  return confirmToken?.id
  // return 'kmynyng@gmail.com'
}

export async function generatePasswordHash(password: string) {
  return bcrypt.hash(password, PASSWORD_SALT_ROUND)
}

export function confirmPassword(encoded: string, plain: string) {
  if (!encoded || !plain) {
    return false
  }
  return bcrypt.compare(plain, encoded)
}

// export const generatePasswordHash = (password: string) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, PASSWORD_SALT_ROUND, (err: any, hash: string) => {
//       if (!err) {
//         resolve({ result: hash, error: null })
//       } else {
//         reject({ error: err, result: null })
//       }
//     })
//   })
// }

// export const confirmPassword = (encoded: string, plain: string) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(plain, encoded, (err, res) => {
//       if (!err) {
//         resolve({ result: res, error: null })
//       } else {
//         reject({ result: null, error: err })
//       }
//     })
//   })
// }

// const resetPasswordAuthCode = new Map<string, ResetPassword>()

// export const generateResetPasswordCode = (email: string) => {
//   const today = Date.now()
//   const passwordAuth = resetPasswordAuthCode.get(email)
//   if (passwordAuth) {
//     const authTime = getAuthTime(Date.now())
//     if (passwordAuth.createdAt >= authTime) {
//       return passwordAuth.code
//     } else {
//       resetPasswordAuthCode.delete(email)
//       const code = uuid.generate()
//       resetPasswordAuthCode.set(email, {
//         code: code,
//         createdAt: today,
//       })
//       return code
//     }
//   } else {
//     const code = uuid.generate()
//     resetPasswordAuthCode.set(email, {
//       code: code,
//       createdAt: today,
//     })
//     resetPasswordAuthCode.forEach((resetPassword, key) => {
//       const authTime = getAuthTime(Date.now())
//       if (resetPassword.createdAt < authTime) {
//         resetPasswordAuthCode.delete(key)
//       }
//     })
//     return code
//   }
// }

// export const confirmResetPasswordCode = (email: string, code: string) => {
//   const resetPasswordAuth = resetPasswordAuthCode.get(email)
//   if (resetPasswordAuth) {
//     const authTime = getAuthTime(Date.now())
//     if (resetPasswordAuth.createdAt >= authTime) {
//       resetPasswordAuthCode.delete(email)
//       return resetPasswordAuth.code === code
//     }
//     return false
//   }
//   return false
// }
