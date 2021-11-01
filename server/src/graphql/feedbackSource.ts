import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Publisher, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload, NotificationUpdateTypes } from './notification.type'
import { Context } from 'src/types'
import FeedbackSource, { FeedbackSourceInput, SourceType } from 'src/database/feedbackSource'
import FeedbackIssue from 'src/database/feedbackIssue'
import { FindOptions, Sequelize } from 'sequelize/types'
import { Count } from './options'
import User from 'src/database/user'
import { getFileType, FileType } from 'src/middlewares/s3'
import { findUser, findUserById } from 'src/userCache'
import NoteActivity, { ActivityTargetEnum, ActionEnum } from 'src/database/noteActivity'
import { Repository } from 'sequelize-typescript'
@InputType()
class FeedbackSourceListingOptions {
  @Field({ nullable: true })
  noteId?: string
  @Field(() => Int, { nullable: true })
  referenceSourceId?: number
  @Field(() => Int, { nullable: true, description: 'for detail' })
  id?: number
  @Field(() => Int, { nullable: true })
  offset?: number
  @Field(() => Int, { nullable: true })
  limit?: number
  @Field({ nullable: true })
  order?: string
  @Field({ nullable: true })
  orderBy?: string
  @Field({ nullable: true })
  includeIssues?: boolean
  @Field({ nullable: true })
  includeCreator?: boolean
}

@ObjectType()
class NotificationFeedbackSource {
  @Field(() => [String])
  ids!: string[];
  @Field()
  userId!: string
  @Field(() => Date)
  date!: Date;
  @Field(() => NotificationUpdateTypes)
  type!: NotificationUpdateTypes
  @Field(() => [FeedbackSource], { nullable: true })
  items?: FeedbackSource[]
}

type CreateNoteActivityOptions = {
  db: Sequelize
  publish: Publisher<any>
  noteId: string
  activityTarget: ActivityTargetEnum,
  action: ActionEnum,
  comment?: string,
  sourceId?: number,
  issueId?: number,
}

@Resolver()
export class FeedbackSourceResolver {
  @Mutation(() => FeedbackSource)
  async createFeedbackSource(
    @Arg('input') input: FeedbackSourceInput,
    @PubSub('feedbackSourceChanged') publish: Publisher<NotificationFeedbackSource>,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackSource> {
    if (!input.noteId && !input.referenceSourceId) throw new Error('Either noteId or referenceSourceId should be given for creation')
    if (!userId) throw new Error('User is not loggined')
    if (!input.url) throw new Error('URL is not given')
    const type: SourceType | null = getSourceType(input.url)
    const repo = db.getRepository(FeedbackSource)
    const order = input.order ?? (input.noteId ? await generatePos(repo, input.noteId) : 0)
    console.log({ order })

    const item: FeedbackSource = await repo.create({ creatorId: userId, type, ...input, order })

    // For a performance reason, we use findUser instead of include.push(db.getRepository(User))
    if (item.creatorId) {
      const creator = await findUserById(item.creatorId)
      if (creator) item.creator = creator
    }

    // noteActivity ====================================================================
    const noteActivity = db.getRepository(NoteActivity).create({
      noteId: input.noteId,
      sourceId: item.id,
      action: ActionEnum.added,
      activityTarget: ActivityTargetEnum.source,
      userId,
    })

    await publish({ ids: [item.id.toString()], userId, items: [item], type: NotificationUpdateTypes.created, date: new Date() })
    return item
  }

  @Query(() => [FeedbackSource], { nullable: true })
  async feedbackSourcesList(
    @Arg('options') options: FeedbackSourceListingOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackSource[] | null> {
    const { offset, limit, order, orderBy, noteId, includeCreator, includeIssues, referenceSourceId } = options
    if (!noteId  && !referenceSourceId) throw new Error('noteId or referenceSourceId is not given')
    // if (!listing) throw new Error('ListingId is not given')
    // const { offset, limit, order, orderBy } = listing

    // console.log('feedbackSourcesList', { options })
    const repo = db.getRepository(FeedbackSource)
    const include = []
    if (includeIssues) include.push(db.getRepository(FeedbackIssue))

    let where = {}
    if (noteId) where = { noteId }
    if (referenceSourceId) where = { referenceSourceId }

    let findOptions: FindOptions = {
      where,
      order: [[orderBy ?? 'updatedAt', order ?? 'DESC']],
      include,
    }
    if (offset) findOptions = { ...findOptions, offset }
    if (limit) findOptions = { ...findOptions, limit }
    const res: FeedbackSource[] = await repo.findAll(findOptions)
    if (referenceSourceId) {
      // console.log('referenceSourceId', { findOptions, res: JSON.stringify(res) })
    }

    // For a performance reason, we use findUser instead of include.push(db.getRepository(User))
    if (includeCreator) {
      res.forEach(async (source) => {
        const creator = await findUserById(source.creatorId)
        if (creator) source.creator = creator
      })
    }
    if (includeIssues) {
      res.forEach((source) => {
        source.issues.forEach(async (issue) => {
          const creator = await findUserById(issue.creatorId)
          if (creator) issue.creator = creator
        })
        // set title for first issue if it is none
        // if (!source.title && source.issues[0]?.content) source.title = source.issues[0].content
      })
    }
    return res
  }

  @Query(() => FeedbackSource, { nullable: true })
  async feedbackSourceDetail(
    @Arg('options') options: FeedbackSourceListingOptions,
    @Ctx() { db } : Context,
  ): Promise<FeedbackSource> {
    const { id, includeCreator, includeIssues } = options
    if (!id) throw new Error('id is not given')
    const include = []
    if (includeIssues) include.push(db.getRepository(FeedbackIssue))
    const findOptions: FindOptions = { where: { id }, include }
    const item: FeedbackSource = await db.getRepository(FeedbackSource).findOne(findOptions)

    // For a performance reason, we use findUser instead of include.push(db.getRepository(User))
    if (includeCreator) {
      const creator = await findUserById(item.creatorId)
      if (creator) item.creator = creator
    }
    if (includeIssues) {
      item.issues.forEach(async (issue) => {
        const creator = await findUserById(issue.creatorId)
        if (creator) issue.creator = creator
      })
    }
    return item
  }

  @Mutation(() => FeedbackSource)
  async updateFeedbackSource(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: FeedbackSourceInput,
    @PubSub('feedbackSourceChanged') publish: Publisher<NotificationFeedbackSource>,
    @Ctx() { db, userId } : Context,
  ) {
    // let values = input.existed()
    // values = { ...values, updatedAt: Date.now() }
    // const [count] = await db.getRepository(FeedbackSource).update(values, { where: { id } })

    const item = await db.getRepository(FeedbackSource).findOne({ where: { id } })

    // noteActivity ====================================================================
    const noteActivity = db.getRepository(NoteActivity).create({
      noteId: item.noteId,
      sourceId: item.id,
      action: input?.taskStatus ? ActionEnum.moved : ActionEnum.updated,
      activityTarget: ActivityTargetEnum.source,
      comment: input?.taskStatus ? `from ${item.taskStatus} to ${input?.taskStatus}` : null,
      userId,
    })

    const result = input.responseUpdate(item)
    result.updatedAt = Date.now()
    result.save()

    await publish({ ids: [item.id.toString()], userId, items: [item], type: NotificationUpdateTypes.updated, date: new Date() })
    return result
  }

  @Mutation(() => Count)
  async deleteFeedbackSources(
    @Arg('ids', (type) => [Int]) ids: number[],
    @Ctx() { db, userId }: Context,
    @PubSub('feedbackSourceChanged') publish: Publisher<NotificationFeedbackSource>,
  ) {
    const count = await db.getRepository(FeedbackSource).destroy({ where: { id: ids } })
    await publish({ ids: ids.map((id) => id.toString()), userId, type: NotificationUpdateTypes.deleted, date: new Date() })
    return { count }
  }

  @Query(() => Count)
  async feedbackSourcesCount(
    @Arg('noteId', (type) => String) noteId: string,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackSource).count({ where: { noteId } })
    return { count }
  }

  @Subscription(() => NotificationFeedbackSource, {
    topics: 'feedbackSourceChanged',
    // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  })
  feedbackSourceChanged(
    @Arg('token') token: string,
    @Root() { ids, type, items }: NotificationFeedbackSource,
  ) {
    console.log('feedbackSourceChanged published', { user: findUser(token), type, ids })
    return { ids, items, type, date: new Date() }
  }
}

function getSourceType(url: string) {
  let type: SourceType | null = null
  const fileType = getFileType(url)
  if (fileType === FileType.image) { type = SourceType.image }
  if (fileType === FileType.pdf || fileType === FileType.pdfConvereted) { type = SourceType.file }
  if (fileType === FileType.video) { type = SourceType.video }
  if (fileType === FileType.none) { type = SourceType.board }
  return type
}

async function generatePos(repo: Repository<FeedbackSource>, noteId: string) {
  const maxPos = await repo.max('order', { where: { noteId } })
  if (maxPos) {
    console.log(maxPos, Math.ceil((maxPos + 1) / 10000) * 10000)
  }
  const pos = maxPos ? Math.ceil((maxPos + 1) / 10000) * 10000 : 10000
  return pos
}
