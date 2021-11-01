import { Arg, Ctx, Field, ID, InputType, Int, Mutation, ObjectType, Publisher, PubSub, Query, registerEnumType, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload, NotificationUpdateTypes, SubItemUpdateType } from './notification.type'
import { Context } from 'src/types'
import FeedbackIssue, { FeedbackIssueInput, FeedbackIssueType } from 'src/database/feedbackIssue'

import { Count } from './options'
import FeedbackActionRecord from 'src/database/feedbackActionRecord'
import FeedbackSnapshot from 'src/database/feedbackSnapshot'
import { FindOptions } from 'sequelize/types'
import { Repository, Sequelize } from 'sequelize-typescript'
import { findUser } from 'src/userCache'
import NoteActivity, { ActionEnum, ActivityTargetEnum } from 'src/database/noteActivity'

@InputType()
class FeedbackIssueListingOptions {
  @Field({ nullable: true })
  offset?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  order?: string;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  noteId?: string
  @Field({ nullable: true })
  sourceId?: number
  @Field({ nullable: true })
  includeActionRecord?: boolean
  @Field({ nullable: true })
  includeSnapshot?: boolean
}

@InputType()
class FeedbackIssueDetailOptions {
  @Field({ nullable: false })
  id!: number
  @Field({ nullable: true })
  includeActionRecord?: boolean
  @Field({ nullable: true })
  includeSnapshot?: boolean
}

// @ObjectType()
// class SubscriptionNotificationIssue extends SubscriptionNotification(FeedbackIssue) {}
// @ObjectType()
// class SubscriptionNotificationIssueListing extends SubscriptionNotificationListing(FeedbackIssue) {}

@ObjectType()
class NotificationFeedbackIssue {
  @Field()
  id!: string;
  @Field()
  userId!: string
  @Field({ nullable: true })
  item?: FeedbackIssue
  @Field(() => Date)
  date!: Date;
}

@ObjectType()
class NotificationFeedbackIssueListing {
  @Field((type) => [String])
  ids!: string[];
  @Field()
  userId!: string
  @Field(() => Date)
  date!: Date;
  @Field((type) => [FeedbackIssue], { nullable: true })
  items?: FeedbackIssue[]
  @Field(() => NotificationUpdateTypes)
  type!: NotificationUpdateTypes
}

@Resolver()
export class FeedbackIssueResolver {
  @Mutation(() => FeedbackIssue)
  async createFeedbackIssue(
    @Arg('input') input: FeedbackIssueInput,
    @PubSub('feedbackIssueListingChanged') publish: Publisher<NotificationFeedbackIssueListing>,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackIssue> {
    const { noteId, sourceId } = input
    const { position, content, type, thumbnail, imageUrl, markerId } = input
    if (!sourceId || !noteId) throw new Error('Note ID or Source ID is not given')
    if (!userId) throw new Error('User is not loggined')

    const repo = db.getRepository(FeedbackIssue)
    const order = await generatePos(repo, sourceId)
    const item: FeedbackIssue = await repo.create({
      noteId, sourceId, creatorId: userId, content, type, thumbnail, imageUrl, order, markerId,
    })

    // noteActivity ====================================================================
    const activityContent = (content?.length && content?.length > 16)
      ? `${content?.slice(0, 16)}...`
      : content
    const noteActivity = db.getRepository(NoteActivity).create({
      noteId: input.noteId,
      sourceId: sourceId,
      issueId: item.id,
      action: ActionEnum.added,
      activityTarget: ActivityTargetEnum.issue,
      content: activityContent,
      userId,
    })

    // create subitem - snapshot
    if (position) {
      const snapshotRepo = db.getRepository(FeedbackSnapshot)
      await snapshotRepo.create({ issueId: item.id, position: position })
    }
    await publish({ ids: [item.id.toString()], userId, items: [item], type: NotificationUpdateTypes.created, date: new Date() })
    return repo.findOne({ where: { id: item.id }, include: [db.getRepository(FeedbackSnapshot)] })
  }

  @Query(() => [FeedbackIssue])
  feedbackIssuesList(
    @Arg('options') options: FeedbackIssueListingOptions,
    @Ctx() { db, userId } : Context,
  ) {
    const {
      offset, limit, sourceId, noteId, order, orderBy,
      includeActionRecord, includeSnapshot,
    } = options

    // if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(FeedbackIssue)
    if (!sourceId && !noteId) throw new Error('sourceId or noteId should be given')

    const include = []
    if (includeActionRecord) include.push(db.getRepository(FeedbackActionRecord))
    if (includeSnapshot) include.push(db.getRepository(FeedbackSnapshot))

    let findOptions: FindOptions = {
      order: [[orderBy ?? 'order', order ?? 'ASC']],
      include,
    }
    if (offset) findOptions = { ...findOptions, offset }
    if (limit) findOptions = { ...findOptions, limit }
    if (sourceId) findOptions = { ...findOptions, where: { sourceId } }
    if (noteId) findOptions = { ...findOptions, where: { noteId } }
    return repo.findAll(findOptions)
  }

  @Query(() => FeedbackIssue, { nullable: true })
  async feedbackIssueDetail(
    @Arg('options') options: FeedbackIssueDetailOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackIssue> {
    const { id, includeActionRecord, includeSnapshot } = options

    const include = []
    if (includeActionRecord) include.push(db.getRepository(FeedbackActionRecord))
    if (includeSnapshot) include.push(db.getRepository(FeedbackSnapshot))
    const findOptions: FindOptions = { where: { id }, include }
    const issue = await db.getRepository(FeedbackIssue).findOne(findOptions)
    return issue
  }

  @Mutation(() => FeedbackIssue)
  async updateFeedbackIssue(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: FeedbackIssueInput,
    @Ctx() { db } : Context,
  ) {
    const { content, thumbnail, imageUrl, snapshotOptions, order } = input
    const repo = db.getRepository(FeedbackIssue)
    let values = {}
    values = content ? { ...values, content } : values
    values = thumbnail ? { ...values, thumbnail } : values
    values = imageUrl ? { ...values, imageUrl } : values
    values = order ? { ...values, order } : values

    // update subitem - snapshot
    const snapshotRepo = db.getRepository(FeedbackSnapshot)
    if (snapshotOptions?.type === SubItemUpdateType.delete) {
      await snapshotRepo.destroy({ where: { issueId: id } })
    } else if (snapshotOptions?.type === SubItemUpdateType.upsert) {
      const { position } = snapshotOptions
      if (position) {
        // issueId: id, position: position
        updateOrCreate(snapshotRepo, { issueId: id }, { issueId: id, position: position })
      }
    }
    values = { ...values, updatedAt: Date.now() }
    const [count] = await repo.update(values, { where: { id } })
    const result = await repo.findOne({ where: { id }, include: [db.getRepository(FeedbackSnapshot)] })
    return result
  }

  @Mutation(() => Count)
  async deleteFeedbackIssues(
    @Arg('ids', () => [Int]) ids: number[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackIssue).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async feedbackIssuesCount(
    @Arg('sourceId', (type) => Int) sourceId: number,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackIssue).count({ where: { sourceId } })
    return { count }
  }
  @Subscription(() => NotificationFeedbackIssue, {
    topics: 'feedbackIssueChanged',
    // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  })
  feedbackIssueChanged(
    @Arg('token') token: string,
    @Root() { id, item }: NotificationFeedbackIssue,
  ) {
    console.log('publish feedbackIssueChanged', { id })
    return { id, item, date: new Date() }
  }

  @Subscription(() => NotificationFeedbackIssueListing, {
    topics: 'feedbackIssueListingChanged',
    // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  })
  feedbackIssueListingChanged(
    @Arg('token') token: string,
    @Root() { ids, type, items }: NotificationFeedbackIssueListing,
  ) {
    console.log('feedbackIssueListingChanged published', { user: findUser(token), type, ids })
    return { ids, items, type, date: new Date() }
  }
}

async function updateOrCreate(model: any, where: any, newItem: any) {
  // First try to find the record
  const foundItem = await model.findOne({ where })
  if (!foundItem) {
    // Item not found, create a new one
    const item = await model.create(newItem)
    return  { item, created: true }
  }
  // Found an item, update it
  const item = await model.update(newItem, { where })
  return { item, created: false }
}

async function generatePos(repo: Repository<FeedbackIssue>, sourceId: number) {
  const maxPos = await repo.max('order', { where: { sourceId: sourceId } })
  if (maxPos) {
    console.log(maxPos, Math.ceil((maxPos + 1) / 10000) * 10000)
  }
  const pos = maxPos ? Math.ceil((maxPos + 1) / 10000) * 10000 : 10000
  return pos
}
