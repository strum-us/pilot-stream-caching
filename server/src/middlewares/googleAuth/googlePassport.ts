import { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY } from 'config/secretkey'

import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from 'src/database/user'
// import { UserService } from 'src/database'
import { UserStatus } from 'src/database/models'
import { googleSignInCallbackURL } from 'config/serverenv'
import passport from 'passport'
import sequelize from 'src/database/database'

/**
 * TODO
 * - save tokens with email
 */
export function initGooglePassport() {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET_KEY,
    callbackURL: googleSignInCallbackURL,
  }, async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    const token = {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
    }
    const oauthToken = JSON.stringify(token)
    console.log({ oauthToken })

    const { email, given_name, family_name, picture } = profile._json
    // console.log({ email, given_name, family_name, picture })

    // if have id

    const today = Date.now()
    const user = email && await sequelize.getRepository(User).findOne({ where: { email }})
    if (user) {
      // await UserService.login(user.id, today)
      console.error('TODO LOGIN')
    } else {
      console.error('TODO SIGNUP')
      // const signUpResult = await sequelize.getRepository(User).create({
      //   email,
      //   accountId: email,
      //   oauthToken: oauthToken,
      //   photo: picture,
      //   firstName: given_name,
      //   lastName: family_name,
      // }, UserStatus.alive)
      // console.log({ signUpResult })
    }

    // sign up process
    if (!email) {
      cb('Email not exist')
    } else {
      cb(null, profile)
    }
  }))
}
