import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Publisher, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql'
import { NotificationUpdateTypes } from './notification.type'

import { Context } from 'src/types'
import { Count } from './options'
import NoteAccess, { NoteAccessInput } from 'src/database/noteAccess'
import User from 'src/database/user'
import { WhereOptions } from 'sequelize/types'
import { findUser } from 'src/userCache'

@InputType()
class NoteAccessListingOptions {
  @Field({ nullable: true })
  id?: number
  @Field({ nullable: true })
  noteId?: string
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field({ nullable: true })
  order?: string
  @Field({ nullable: true })
  orderBy?: string
}

@ObjectType()
class NotificationNoteAccess {
  @Field(() => [Int])
  ids!: number[]
  @Field()
  userId!: string
  @Field(() => Date)
  date!: Date;
  @Field(() => NotificationUpdateTypes)
  type!: NotificationUpdateTypes
  @Field(() => [NoteAccess], { nullable: true })
  items?: NoteAccess[];
}

@InputType()
class NoteAccessVerifyOptions {
  @Field()
  noteId!: string
  @Field()
  email!: string
}

@Resolver()
export class NoteAccessResolver {
  @Mutation(() => NoteAccess)
  async createNoteAccess(
    @Arg('input') input: NoteAccessInput,
    @PubSub('noteAccessChanged') publish: Publisher<NotificationNoteAccess>,
    @Ctx() { db, userId } : Context,
  ): Promise<NoteAccess> {
    if (!userId) throw new Error('User is not loggined')
    if (!input.noteId) throw new Error('Note Id is not given')
    const item = db.getRepository(NoteAccess).create({ creatorId: userId, ...input.existed() })
    await publish({ ids: [item.id], userId, items: [item], type: NotificationUpdateTypes.created, date: new Date() })
    return item
  }

  @Query(() => [NoteAccess])
  async noteAccesssList(
    @Arg('options') options: NoteAccessListingOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<NoteAccess[]> {
    const { noteId, offset, limit, order, orderBy  } = options
    if (!userId) throw new Error('User is not loggined')
    if (!noteId) throw new Error('Note Id is not given')

    const repo = db.getRepository(NoteAccess)

    // calculating
    const where: WhereOptions = { noteId }
    const list: NoteAccess[] = await repo.findAll({
      where,
      offset,
      limit,
      order: [[orderBy ?? 'updatedAt', order ?? 'DESC']],
    })
    return list
  }

  @Query(() => NoteAccess, { nullable: true })
  async verifyNoteAccess(
    @Arg('options') options: NoteAccessVerifyOptions,
    @Ctx() { db } : Context,
  ): Promise<NoteAccess | null> {
    const { noteId, email } = options
    // if (!noteId || !email) throw new Error('noteId and email are not given')
    const repo = db.getRepository(NoteAccess)
    const noteAccess = await repo.findOne({
      where: { noteId, email },
      include: [db.getRepository(User)],
    })
    return noteAccess
  }

  @Query(() => NoteAccess, { nullable: true })
  async noteAccessDetail(
    @Arg('options') options: NoteAccessListingOptions,
    @Ctx() { db } : Context,
  ): Promise<NoteAccess | null> {
    const { id } = options
    if (!id) throw new Error('id is not given')
    const repo = db.getRepository(NoteAccess)
    const note = await repo.findOne({
      where: { id },
      include: [db.getRepository(User)],
    })
    return note
  }

  @Mutation(() => NoteAccess, { nullable: true })
  async updateNoteAccess(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: NoteAccessInput,
    @PubSub('noteAccessChanged') publish: Publisher<NotificationNoteAccess>,
    @Ctx() { db, userId } : Context,
  ) {
    try {
      const values = { ...input.existed(), updatedAt: Date.now() }
      const [count] = await db.getRepository(NoteAccess).update(values, { where: { id } })
      if (count > 0) {
        const note = await db.getRepository(NoteAccess).findOne({ where: { id } })
        // TODO Notification
        // await publish({ ids: [id], userId, items: [note], date: new Date(), type: NotificationUpdateTypes.updated })
        return note
      }
    } catch (e) {
      console.error('updateNoteAccess', e)
    }
    return null
  }

  @Mutation(() => Count)
  async deleteNoteAccesss(
    @Arg('ids', (type) => [Int]) ids: number[],
    @PubSub('noteAccessChanged') publish: Publisher<NotificationNoteAccess>,
    @Ctx() { db, userId }: Context,
  ) {
    const count = await db.getRepository(NoteAccess).destroy({ where: { id: ids } })
    await publish({ ids, userId, type: NotificationUpdateTypes.deleted, date: new Date() })
    return { count }
  }

  @Query(() => Count)
  async noteAccesssCount(
    @Arg('noteId', () => String) noteId: string,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(NoteAccess).count({ where: { noteId } })
    return { count }
  }

  @Subscription(() => NotificationNoteAccess, {
    topics: 'noteAccessChanged',
    // filter: async ({ payload, args }) => payload.userId === (await findUser(args.token))?.id,
  })
  noteAccessChanged(
    @Arg('token') token: string,
    @Root() { ids, type, items }: NotificationNoteAccess,
  ) {
    console.log('noteAccessChanged published', { user: findUser(token), type, ids })
    return { ids, items, type, date: new Date() }
  }
}
