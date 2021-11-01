import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload } from './notification.type'
import { Context } from 'src/types'
import FeedbackSnapshot from 'src/database/feedbackSnapshot'
import { Count } from './options'

@InputType()
class CreateFeedbackSnapshotOptions {
  @Field()
  issueId!: number
  @Field({ nullable: true })
  position?: string
}

@InputType()
class UpdateFeedbackSnapshotOptions {
  @Field()
  id!: number
  @Field({ nullable: true })
  position?: string
}

@InputType()
class FeedbackSnapshotListingOptions {
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field()
  issueId!: number
}

@Resolver()
export class FeedbackSnapshotResolver {
  @Mutation(() => FeedbackSnapshot)
  createFeedbackSnapshot(
    @Arg('input') input: CreateFeedbackSnapshotOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackSnapshot> {
    const { issueId, position } = input
    if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(FeedbackSnapshot)
    return repo.create({ issueId, position })
  }

  @Query(() => [FeedbackSnapshot])
  FeedbackSnapshotsList(
    @Arg('options') options: FeedbackSnapshotListingOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackSnapshot[]> {
    const { offset, limit, issueId } = options
    if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(FeedbackSnapshot)
    return repo.findAll({
      where: { issueId },
      order: [['updatedAt', 'DESC']],
      offset,
      limit,
    })
  }

  @Mutation(() => FeedbackSnapshot)
  async updateFeedbackSnapshot(
    @Arg('options') options: UpdateFeedbackSnapshotOptions,
    @Ctx() { db } : Context,
  ) {
    const { id, position } = options
    const repo = db.getRepository(FeedbackSnapshot)
    const item = await repo.findOne({ where: { id } })
    return await repo.update({
      title: position ?? item.position,
    }, {
      where: {
        id,
      },
    })
  }

  @Mutation(() => Count)
  async deleteFeedbackSnapshots(
    @Arg('ids', (type) => [String]) ids: string[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackSnapshot).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async FeedbackSnapshotsCount(
    @Arg('issueId') issueId: number,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackSnapshot).count({ where: { issueId } })
    return { count }
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  FeedbackSnapshotChanged(
    @Arg('title') title: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() }
  }
}
