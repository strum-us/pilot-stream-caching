import { Arg, Ctx, Field, InputType, Int, Mutation, PubSub, PubSubEngine, Query, Resolver } from 'type-graphql'
import { Count, SearchOptions } from './options'
import { FindOptions, Transaction, WhereOptions } from 'sequelize'
import User, { UserInput, UserStatus } from 'src/database/user'
import UserLog, { ActivityType } from 'src/database/userLog'
import { confirmPassword, generateJwtToken, generatePasswordHash, generateVerificationToken } from 'src/middlewares/auth/token'
import { feedbackRecipient, mailingRepEmail } from 'config/serverenv'

import Admin from 'src/database/Admin'
import { Context } from 'src/types'
import { EmailFormat } from 'src/middlewares/emailSender/emailFormat'
import { customAlphabet } from 'nanoid/async'
import { sendMail } from 'src/middlewares/emailSender'
import sequelize from 'src/database/database'

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 9)

@InputType()
export class UpdateUserOptions {
  @Field()
  id!: string
  @Field({ nullable: true })
  email?: string
  @Field({ nullable: true })
  password?: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  lastName?: string
  @Field({ nullable: true })
  photo?: string
  @Field({ nullable: true })
  onboarding?: string
}

@InputType()
export class UserListingOptions {
  @Field()
  adminId!: string
  @Field((type) => Int, { nullable: true })
  offset?: number
  @Field((type) => Int, { nullable: true })
  limit?: number
  @Field({ nullable: true })
  order?: string
  @Field({ nullable: true })
  orderBy?: string
}

@InputType()
class UserDetailOptions {
  @Field({ nullable: true })
  id?: string
}

@InputType()
export class SingInUserOptions {
  @Field({ nullable: true })
  accountId!: string
  @Field({ nullable: true })
  password?: string
  @Field({ nullable: true })
  oAuthToken?: string
  @Field({ nullable: true })
  invitedToken?: string
}
@InputType()
export class GoogleSignInOptions {
  @Field()
  email!: string
  @Field()
  uid!: string
  @Field({ nullable: true })
  firstName!: string
  @Field({ nullable: true })
  lastName?: string
  @Field({ nullable: true })
  accessToken?: string
  @Field({ nullable: true })
  photo?: string
  @Field({ nullable: true })
  language?: string
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('input') input: UserInput,
    @Ctx() { db }: Context,
  ): Promise<User> {
    const userDb = db.getRepository(User)
    const { email, password, userStatus } = input
    if (!email || !password) throw Error('Auth info not given')
    const accountId = email
    const user: User = await userDb.findOne({ where: { accountId } })

    // For visitor
    // TODO: fix to later. it is exception
    if (userStatus === UserStatus.visitor) {
      if (user && user.userStatus === UserStatus.visitor && password === 'need-to-reset') {
        return user
      }
    }
    // for basic user
    if (user) throw Error('Given email address is already taken')

    // create unique ID
    const transaction = await sequelize.transaction()
    try {
      const id = await generateUniqueUserID(transaction)
      const encodedPassword = await generatePasswordHash(password)
      const token = generateJwtToken(accountId)
      const user = await userDb.create({ id, accountId: input.email, email, password: encodedPassword, token, userState: UserStatus.alive }, transaction)
      await transaction.commit()
      return user
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  }

  @Query(() => [User])
  userList(
    @Arg('options') options: UserListingOptions,
    @Ctx() { db } : Context,
  ) {
    const { adminId, offset, limit,  order, orderBy } = options
    // const admin = db.getRepository(Admin).findAll({ where: { accountId: adminId } })
    // if (!admin) throw Error('Not permmited')

    const repo = db.getRepository(User)
    // const include = []
    // if (includeActionRecord) include.push(db.getRepository(FeedbackActionRecord))
    // if (includeSnapshot) include.push(db.getRepository(FeedbackSnapshot))

    let findOptions: FindOptions = {
      order: [[orderBy ?? 'updatedAt', order ?? 'ASC']],
      // include,
    }
    if (offset) findOptions = { ...findOptions, offset }
    if (limit) findOptions = { ...findOptions, limit }
    return repo.findAll(findOptions)
  }

  @Query(() => User, { nullable: true })
  async userDetail(
    @Arg('options') options: UserDetailOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<User | null> {
    const { id } = options
    // const include = []
    // if (includeActionRecord) include.push(db.getRepository(FeedbackActionRecord))
    // if (includeSnapshot) include.push(db.getRepository(FeedbackSnapshot))
    let where: WhereOptions = {}
    if (id) where = { ...where, id }
    else if (userId) where = { ...where, id: userId }
    else return null
    const user = await db.getRepository(User).findOne({ where })
    return user
  }

  @Mutation(() => Count)
  async updateUser(
    @Arg('options') options: UpdateUserOptions,
    @Ctx() { db } : Context,
  ) {
    const { id, email, password, firstName, lastName, onboarding, photo } = options
    let values = {}
    values = email ? { ...values, email } : values
    values = firstName ? { ...values, firstName } : values
    values = lastName ? { ...values, lastName } : values
    values = photo ? { ...values, photo } : values
    values = onboarding ? { ...values, onboarding } : values
    values = { ...values, updatedAt: Date.now() }

    if (password) {
      const encodedPassword = await generatePasswordHash(password)
      // if (user.password !== encodedPassword) return Throw
      values = password ? { ...values, password: encodedPassword } : values
    }

    const [count] = await db.getRepository(User).update(values, { where: { id } })
    return { count }
  }

  @Mutation(() => Count)
  async deleteUsers(
    @Arg('ids', (type) => [String]) ids: string[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(User).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async userCount(@Ctx() { db }: Context) {
    const count = await db.getRepository(User).count()
    return { count }
  }

  @Mutation(() => User)
  async signIn(
    @Arg('options') options: SingInUserOptions,
    @Ctx() { db }: Context,
    @PubSub() pubsub: PubSubEngine,
  ) {
    const { accountId, password } = options
    const userDb = sequelize.getRepository(User)
    const user = await userDb.findOne({ where: { accountId } })
    if (!user) throw Error('Not exiting user : ' + accountId)
    if (!password) throw Error('Password is not given')

    console.log('signing', { user })
    const isMatchPassword = await confirmPassword(user.password, password)
    if (!isMatchPassword) throw Error('Wrong password')
    const token = generateJwtToken(accountId)
    userDb.update({
      updatedAt: Date.now(),
      token: token,
    }, {
      where: {
        id: user.id,
      },
    })

    db.getRepository(UserLog).create({ userId: user.id, type: ActivityType.login }) // add user log
    // pubsub.publish('NOTIFICATIONS', { message: accountId })
    return user
  }

  @Mutation(() => User)
  async logout(
    @Ctx() { db, userId }: Context,
    @PubSub() pubsub: PubSubEngine,
  ) {
    const userDb = sequelize.getRepository(User)
    const user = await userDb.findOne({ where: { id: userId } })

    db.getRepository(UserLog).create({ userId: user.id, type: ActivityType.logout }) // add user log
    // pubsub.publish('NOTIFICATIONS', { message: accountId })
    return user
  }

  // utils
  // resetPassword: async (_: any, { email }: MutationEmailVerificationArgs, { }: GraphqlContext) => {
  @Mutation(() => User)
  async resetPassword(
    @Arg('email') email: string,
    @Ctx() { db }: Context,
  ): Promise<User> {
    const user = await db.getRepository(User).findOne({ where: { email } })
    if (!user) throw Error('Not exiting user : ' + email)
    db.getRepository(User).update({ password: '' }, { where: { id: user.id } })
    const token = generateVerificationToken(email)
    const title = 'Reset password'
    const emailHtml = EmailFormat.verificationEmail(email, token)
    sendMail(title, [email], emailHtml, mailingRepEmail)
    return user
  }

  @Mutation(() => User)
  async googleSignIn(
    @Arg('options') options: GoogleSignInOptions,
    @Ctx() { db }: Context,
  ): Promise<User> {
    const { email, firstName, lastName, accessToken, photo, language } = options
    const accountId = email
    const userDb = db.getRepository(User)
    let user = await userDb.findOne({ where: { email } })
    const token = generateJwtToken(accountId)

    // 1. exsiting user from that not auth
    if (user) throw Error('existing user')
    // if (user) {
    //   await userDb.update({ accountId, email, firstName, lastName, token, oauthToken: accessToken, oauthProvider, photo, language }, { where: { id: user.id } })
    // }

    user = await userDb.create({ accountId, email, firstName, lastName, photo, token, oauthToken: accessToken, language, oauthProvider: 'google' })
    sendUserSignUpMail(user, language ?? '', true)
    return user
  }

  @Query(() => [User])
  async findUserByAllKeyword(
    @Arg('options') options: SearchOptions,
    @Ctx() { db }: Context,
  ) {
    const { keyword, offset, limit } = options
    return db.getRepository(User).findAll({
      where: {
        $or: [
          { id: { $like: '%' + keyword + '%' } },
          { email: { $like: '%' + keyword + '%' } },
          { firstName: { $like: '%' + keyword + '%' } },
          { lastName: { $like: '%' + keyword + '%' } },
        ],
      },
      order: [['createdAt', 'ASC']],
      offset,
      limit: limit ? limit : 20,
    })
  }

  @Query(() => [User])
  findByAccountIdKeyword(
    @Arg('accountId') accountId: string,
    @Ctx() { db }: Context,
  ) {
    const userDb = db.getRepository(User)
    return userDb.findAll({
      attributes: ['accountId', 'firstName', 'id', 'photo'],
      where: {
        accountId: {
          $like: '%' + accountId + '%',
        },
        userStatus: UserStatus.alive,
      },
      order: [
        [
          'id',
          'ASC',
        ],
      ],
    })
  }

  @Query(() => [User])
  findUserByFullnameKeyword(
    @Arg('keyword') keyword: string,
    @Ctx() { db }: Context,
  ) {
    const userDb = db.getRepository(User)
    return userDb.findAll({
      attributes: ['accountId', 'firstName', 'lastName', 'id', 'photo'],
      where: {
        firstName: {
          $like: '%' + keyword + '%',
        },
        lastName: {
          $like: '%' + keyword + '%',
        },
        userStatus: UserStatus.alive,
      },
      order: [
        [
          'id',
          'ASC',
        ],
      ],
    })
  }

  @Query(() => User)
  findByEmail(@Arg('email') email: string) {
    const userDb = sequelize.getRepository(User)
    return userDb.findOne({
      where: {
        email,
        userStatus: UserStatus.alive,
      },
    })
  }

  // @Query(() => [User])
  // findByEmails(@Arg('emails') emails: string[]) {
  //   const userDb = sequelize.getRepository(User)
  //   return userDb.findAll({
  //     where: {
  //       email: { $in: emails },
  //       userStatus: UserStatus.alive,
  //     },
  //   })
  // }

  // @Query(() => [User])
  // findNonRegisterdByEmails(@Arg('emails') emails: string[]) {
  //   const userDb = sequelize.getRepository(User)
  //   return userDb.findAll({
  //     where: {
  //       email: { $in: emails },
  //       userStatus: { $not: UserStatus.alive },
  //     },
  //   })
  // }

  // @Subscription()
  // loginNotification() {

  // }

  // @Subscription({
  //   topics: 'NOTIFICATIONS',
  //   filter: ({ args, payload }) => args.priorities.includes(payload.priority),
  // })
  // loginNotification() {

  // }
}

export async function generateUniqueUserID(transaction?: Transaction) {
  const userDb = sequelize.getRepository(User)
  let id = 'U' + await nanoid()
  let other = await userDb.findOne({ where: { id }, transaction })
  while (other !== null) {
    id = 'U' + await nanoid()
    other = await userDb.findOne({ where: { id }, transaction })
  }
  return id
}

function sendUserSignUpMail(user: User, language: string, googleLogin: boolean) {
  const title = `[SignUp User] ${user.accountId}`
  const htmlText = `
    - email: ${user.accountId}<br>
    - language: ${language}<br>
    - googleLogin? : ${googleLogin}<br>
    - name: ${user.firstName} ${user.lastName}<br><br>
    
  `
  console.log('send user signup mail >>', user.accountId)
  sendMail(title, [feedbackRecipient], htmlText, mailingRepEmail)
}
