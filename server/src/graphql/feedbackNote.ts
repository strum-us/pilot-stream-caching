import { Arg, Ctx, Field, ID, InputType, Int, Mutation, ObjectType, Publisher, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload, NotificationUpdateTypes } from './notification.type'

import { Context } from 'src/types'
import { Count } from './options'
import FeedbackIssue from 'src/database/feedbackIssue'
import FeedbackNote, { FeedbackNoteInput } from 'src/database/feedbackNote'
import FeedbackSource from 'src/database/feedbackSource'
import User from 'src/database/user'
import { WhereOptions } from 'sequelize/types'
import shortid from 'short-uuid'
import { accountIdFromToken } from 'src/middlewares/auth/token'
import { findUser } from 'src/userCache'
import sequelize from 'src/database/database'
const translator = shortid()

@InputType()
class CreateFeedbackNoteOptions {
  @Field((type) => Int, { nullable: true })
  projectId?: number
}

@InputType()
class FeedbackNoteListingOptions {
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field({ nullable: true })
  order?: string
  @Field({ nullable: true })
  orderBy?: string
  @Field((type) => Int, { nullable: true })
  projectId?: number
  @Field({ nullable: true })
  includeLastSource?: boolean
  @Field({ nullable: true })
  includeNumberOfSources?: boolean
}

@InputType()
class FeedbackNoteDetailOptions {
  @Field({ nullable: true })
  id!: string
  @Field({ nullable: true })
  includeLastSource?: boolean
  @Field({ nullable: true })
  includeNumberOfSources?: boolean
}
@ObjectType()
class NotificationFeedbackNote {
  @Field()
  id!: string
  @Field({ nullable: true })
  userId?: string
  @Field({ nullable: true })
  item?: FeedbackNote
  @Field(() => Date)
  date!: Date;
  @Field(() => NotificationUpdateTypes, { nullable: true })
  type?: NotificationUpdateTypes
}

@ObjectType()
class NotificationFeedbackNoteListing {
  @Field(() => [String])
  ids!: string[]
  @Field({ nullable: true })
  userId?: string
  @Field(() => Date)
  date!: Date;
  @Field(() => [FeedbackNote], { nullable: true })
  items?: FeedbackNote[]
  @Field(() => NotificationUpdateTypes)
  type!: NotificationUpdateTypes
}

@Resolver()
export class FeedbackNoteResolver {
  @Mutation(() => FeedbackNote)
  async createFeedbackNote(
    @Arg('input') input: FeedbackNoteInput,
    @Arg('options') options: CreateFeedbackNoteOptions,
    @PubSub('feedbackNoteListingChanged') publish: Publisher<NotificationFeedbackNoteListing>,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackNote> {
    const { projectId } = options
    if (!userId) throw new Error('User is not loggined')
    // console.log('createNote', { userId, title, thumbnail })

    // create unique ID
    const id = await this.generateUniqueId()
    const repo = db.getRepository(FeedbackNote)
    const item = repo.create({ id, projectId, creatorId: userId, ...input })
    await publish({ ids: [id], userId, items: [item], type: NotificationUpdateTypes.created, date: new Date() })
    return item
  }

  @Query(() => [FeedbackNote])
  async feedbackNotesList(
    @Arg('options') options: FeedbackNoteListingOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackNote[]> {
    if (!userId) throw new Error('User is not loggined')
    const { offset, limit, order, orderBy, projectId, includeLastSource, includeNumberOfSources } = options
    const repo = db.getRepository(FeedbackNote)

    // calculating
    let where: WhereOptions = { creatorId: userId }
    if (projectId) where = { ...where, projectId }
    const list: FeedbackNote[] = await repo.findAll({
      where,
      order: [[orderBy ?? 'updatedAt', order ?? 'DESC']],
      offset,
      limit,
    })

    // return first thumbnail of source
    await Promise.all(list.map(async (note, idx) => {
      if (includeLastSource) {
        const sources: FeedbackSource[] = await db.getRepository(FeedbackSource).findAll({
          where: { noteId: note.id },
          order: [['updatedAt', 'DESC']],
          limit: 1,
        })
        // console.log({ id: note.id, source })
        // list[idx].thumbnail = JSON.stringify(sources?.map((source) => source.imageUrl ?? source.url))
        list[idx].thumbnail = sources[0]?.imageUrl ?? sources[0]?.url
        list[idx].lastSourceId = sources[0]?.id
      }

      if (includeNumberOfSources) {
        list[idx].numberOfSources = await db.getRepository(FeedbackSource).count({
          where: { noteId: note.id },
        })
      }
    }))
    return list
  }

  @Query(() => FeedbackNote, { nullable: true })
  async feedbackNoteDetail(
    @Arg('options') options: FeedbackNoteDetailOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackNote | null> {
    const { id, includeNumberOfSources, includeLastSource } = options
    const repo = db.getRepository(FeedbackNote)
    const note = await repo.findOne({
      where: { id },
      include: [db.getRepository(User)],
    })
    if (!note) return null
    // return first thumbnail of source
    if (includeLastSource) {
      const source = await db.getRepository(FeedbackSource).findOne({
        where: { noteId: note.id },
        order: [['updatedAt', 'DESC']],
      })
      note.thumbnail = source?.imageUrl ?? source?.thumbnail
      note.lastSourceId = source?.id
    }

    if (includeNumberOfSources) {
      note.numberOfSources = await db.getRepository(FeedbackSource).count({
        where: { noteId: note.id },
      })
    }
    return note
  }

  @Mutation(() => FeedbackNote, { nullable: true })
  async updateFeedbackNote(
    @Arg('id') id: string,
    @Arg('input') input: FeedbackNoteInput,
    @PubSub('feedbackNoteChanged') publish: Publisher<NotificationFeedbackNote>,
    @Ctx() { db, userId } : Context,
  ) {
    try {
      // const { id, title, thumbnail, description } = input
      // let values = { }
      // values = title ? { ...values, title } : values
      // values = thumbnail ? { ...values, thumbnail } : values
      // values = description ? { ...values, description } : values
      const values = { ...input.existed(), updatedAt: Date.now() }
      const [count] = await db.getRepository(FeedbackNote).update(values, { where: { id } })
      if (count > 0) {
        const note = await db.getRepository(FeedbackNote).findOne({ where: { id } })
        console.log('updateFeedbackNote', id, userId)
        await publish({ id, userId, item: note, date: new Date() })
        return note
      }
    } catch (e) {
      console.error('updateFeedbackNote', e)
    }
    return null
  }

  @Mutation(() => Count)
  async deleteFeedbackNotes(
    @Arg('ids', (type) => [String]) ids: string[],
    @PubSub('feedbackNoteListingChanged') publish: Publisher<NotificationFeedbackNoteListing>,
    @Ctx() { db, userId }: Context,
  ) {
    const count = await db.getRepository(FeedbackNote).destroy({ where: { id: ids } })
    await publish({ ids, userId, type: NotificationUpdateTypes.deleted, date: new Date() })
    return { count }
  }

  @Query(() => Count)
  async feedbackNotesCount(
    @Arg('projectId', (type) => Int) projectId: number,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackNote).count({ where: { projectId } })
    return { count }
  }

  @Subscription(() => NotificationFeedbackNote, {
    topics: 'feedbackNoteChanged',
    // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  })
  feedbackNoteChanged(
    @Arg('token') token: string,
    @Root() { id, item }: NotificationFeedbackNote,
  ) {
    console.log('publish feedbackNoteChanged', { id })
    return { id, item, date: new Date() }
  }

  @Subscription(() => NotificationFeedbackNoteListing, {
    topics: 'feedbackNoteListingChanged',
    // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  })
  async feedbackNoteListingChanged(
    @Arg('token') token: string,
    @Root() { ids, type, userId, items }: NotificationFeedbackNoteListing,
  ) {
    console.log('feedbackNoteListingChanged published', { userId, target: (await findUser(token))?.id, type, ids })
    return { ids, userId, items, type, date: new Date() }
  }

  // will be deprecated
  @Query(() => FeedbackNote)
  async feedbackNoteLastOne(
      @Ctx() { db, userId } : Context,
  ): Promise<FeedbackNote> {
    const repo = db.getRepository(FeedbackNote)
    const note = await repo.findOne({
      where: { creatorId: userId },
      order: [['updatedAt', 'DESC']],
    })
    note.numberOfIssues = await db.getRepository(FeedbackIssue).count({
      where: { noteId: note.id },
    })
    return note
  }

  private async generateUniqueId() {
    const repo = sequelize.getRepository(FeedbackNote)
    let id = await translator.new()
    let other = await repo.findOne({ where: { id } })
    while (other !== null) {
      id = await translator.new()
      other = await repo.findOne({ where: { id } })
    }
    return id
  }
}
