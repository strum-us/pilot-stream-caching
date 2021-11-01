import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, Subscription } from 'type-graphql'
import { NotificationUpdateTypes } from './notification.type'
import { Context } from 'src/types'
import { FindOptions } from 'sequelize/types'
import { Count } from './options'
import NoteActivity, { NoteActivityInput } from 'src/database/noteActivity'
import User from 'src/database/user'

@InputType()
class NoteActivityListingOptions {
  @Field()
  noteId!: string
  // @Field({ nullable: true })
  // referenceSourceId?: string
  @Field((type) => Int, { nullable: true })
  offset?: number
  @Field((type) => Int, { nullable: true })
  limit?: number
  @Field({ nullable: true })
  order?: string
  @Field({ nullable: true })
  orderBy?: string
  // @Field({ nullable: true })
  // includeIssues?: boolean
  @Field({ nullable: true })
  includeUser?: boolean
}

@Resolver()
export class NoteActivityResolver {
  // @Mutation(() => NoteActivity)
  // async createNoteActivity(
  //   @Arg('input') input: NoteActivityInput,
  //   @Arg('options') options: CreateNoteActivityOptions,
  //   @Ctx() { db, user, userId } : Context,
  // ): Promise<NoteActivity> {
  //   const { noteId } = options
  //   if (!userId) throw new Error('User is not loggined')
  //   const repo = db.getRepository(NoteActivity)

  //   // noteActivity
  //   const noteActivity = await db.getRepository(NoteActivity).create({ noteId: noteId, comment: 'create source', userId })
  //   console.log({ noteActivity })

  //   return repo.create({ noteId, creatorId: userId, type, ...input })
  // }

  @Query(() => [NoteActivity], { nullable: true })
  async noteActivityList(
    @Arg('options') options: NoteActivityListingOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<NoteActivity[] | null> {
    const { offset, includeUser, limit, noteId, orderBy, order } = options
    if (!noteId) return null
    const repo = db.getRepository(NoteActivity)
    const include = []
    if (includeUser) include.push(db.getRepository(User))

    let where = {}
    if (noteId) where = { noteId }
    // if (referenceSourceId) where = { referenceSourceId }

    let findOptions: FindOptions = {
      where,
      order: [[orderBy ?? 'updatedAt', order ?? 'DESC']],
      include,
    }
    if (offset) findOptions = { ...findOptions, offset }
    if (limit) findOptions = { ...findOptions, limit }
    const res: NoteActivity[] = await repo.findAll(findOptions)
    // res.forEach((item) => console.log({ item }))
    // For a performance reason, we use findUser
    // if (includeIssues) {
    //   res.forEach((source) => source.issues.forEach(async (issue) => {
    //     const creator = await findUserById(issue.creatorId)
    //     if (creator) issue.creator = creator
    //   }))
    // }
    return res
  }

  @Mutation(() => NoteActivity)
  async updateNoteActivity(
    // @Arg('options') options: UpdateNoteActivityOptions,
    @Arg('id', () => Int) id: number,
    @Arg('input') input: NoteActivityInput,
    @Ctx() { db } : Context,
  ) {
    let values = input.existed()
    values = { ...values, updatedAt: Date.now() }
    const [count] = await db.getRepository(NoteActivity).update(values, { where: { id } })
    return await db.getRepository(NoteActivity).findOne({ where: { id } })
  }

  @Mutation(() => Count)
  async deleteNoteActivitys(
    @Arg('ids', (type) => [Int]) ids: number[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(NoteActivity).destroy({ where: { id: ids } })
    return { count }
  }

  // @Query(() => NoteActivity, { nullable: true })
  // async feedbackSourceDetail(
  //   @Arg('options') options: NoteActivityDetailOptions,
  //   @Ctx() { db } : Context,
  // ): Promise<NoteActivity> {
  //   const { id, includeCreator, includeIssues } = options
  //   const include = []
  //   if (includeIssues) include.push(db.getRepository(FeedbackIssue))
  //   if (includeCreator) include.push(db.getRepository(User))
  //   const findOptions: FindOptions = { where: { id }, include }
  //   return await db.getRepository(NoteActivity).findOne(findOptions)
  // }
  // @Query(() => Count)
  // async noteActivityCount(
  //   @Arg('noteId', (type) => String) noteId: string,
  //   @Ctx() { db }: Context,
  // ) {
  //   const count = await db.getRepository(NoteActivity).count({ where: { noteId } })
  //   return { count }
  // }

  // @Subscription(() => NotificationNoteActivity, {
  //   topics: 'feedbackSourceChanged',
  //   // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  // })
  // feedbackSourceChanged(
  //   @Arg('token') token: string,
  //   @Root() { ids, type, items }: NotificationNoteActivity,
  // ) {
  //   console.log('feedbackSourceChanged published', { user: findUser(token), type, ids })
  //   return { ids, items, type, date: new Date() }
  // }
}
