import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload } from './notification.type'
import { Context } from 'src/types'
import FeedbackComment from 'src/database/feedbackComment'
import sequelize from 'src/database/database'
import { Count } from './options'
import { IsInt } from 'sequelize-typescript'
import User from 'src/database/user'

@InputType()
class CreateFeedbackCommentOptions {
  @Field()
  noteId!: string
  @Field()
  issueId!: number
  @Field({ nullable: true })
  title?: string
  @Field({ nullable: true })
  thumbnail?: string
}

@InputType()
class UpdateFeedbackCommentOptions {
  @Field()
  id!: number
  @Field({ nullable: true })
  title?: string
  @Field({ nullable: true })
  thumbnail?: string
}

@InputType()
class FeedbackCommentListingOptions {
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field()
  issueId!: number
}

@Resolver()
export class FeedbackCommentResolver {
  @Mutation(() => FeedbackComment)
  createFeedbackComment(
    @Arg('input') input: CreateFeedbackCommentOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackComment> {
    const { noteId, issueId, title, thumbnail } = input
    if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(FeedbackComment)
    return repo.create({ noteId, issueId, creatorId: userId, title, thumbnail })
  }

  @Query(() => [FeedbackComment])
  feedbackCommentsList(
    @Arg('options') options: FeedbackCommentListingOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackComment[]> {
    const { offset, limit, issueId } = options
    const repo = db.getRepository(FeedbackComment)
    return repo.findAll({
      where: { creatorId: userId, issueId },
      order: [['updatedAt', 'DESC']],
      offset,
      limit,
    })
  }

  @Query(() => FeedbackComment)
  async feedbackCommentDetail(
    @Arg('id') id: number,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackComment> {
    const repo = db.getRepository(FeedbackComment)
    const comment = await repo.findOne({
      where: { id },
      include: [db.getRepository(User)],
    })
    return comment
  }

  @Mutation(() => FeedbackComment)
  async updateFeedbackComment(
    @Arg('options') options: UpdateFeedbackCommentOptions,
    @Ctx() { db } : Context,
  ) {
    const { id, title, thumbnail } = options
    const repo = db.getRepository(FeedbackComment)
    const item = await repo.findOne({ where: { id } })
    return await repo.update({
      title: title ?? item.title,
      thumbnail: thumbnail ?? item.thumbnail,
    }, {
      where: {
        id,
      },
    })
  }

  @Mutation(() => Count)
  async deleteFeedbackComments(
    @Arg('ids', (type) => [String]) ids: string[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackComment).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async feedbackCommentsCount(
    @Arg('issueId') issueId: number,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackComment).count({ where: { issueId } })
    return { count }
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  feedbackCommentChanged(
    @Arg('title') title: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() }
  }
}
