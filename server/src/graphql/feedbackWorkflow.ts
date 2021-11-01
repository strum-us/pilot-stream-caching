import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver } from 'type-graphql'

import { Context } from 'src/types'
import { Count } from './options'
import FeedbackWorkflow from 'src/database/feedbackWorkflow'

@InputType()
class CreateFeedbackWorkflowOptions {
  @Field()
  settings!: string
}

@Resolver()
export class FeedbackWorkflowResolver {
  @Mutation(() => FeedbackWorkflow)
  createFeedbackWorkflow(
    @Arg('input') input: CreateFeedbackWorkflowOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackWorkflow> {
    const { settings } = input
    if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(FeedbackWorkflow)
    return repo.create({ creatorId: userId, settings })
  }

  @Query(() => FeedbackWorkflow)
  async currentFeedbackWorkflow(
    @Ctx() { db, userId } : Context,
  ): Promise<FeedbackWorkflow> {
    const repo = db.getRepository(FeedbackWorkflow)
    const note = await repo.findOne({
      where: { creatorId: userId },
      order: [['createdAt', 'ASC']],
    })
    return note
  }

  @Mutation(() => Count)
  async deleteFeedbackWorkflows(
    @Arg('ids', (type) => [Int]) ids: number[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(FeedbackWorkflow).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async feedbackWorkflowsCount(
    @Ctx() { db, userId }: Context,
  ) {
    const count = await db.getRepository(FeedbackWorkflow).count({ where: { creatorId: userId } })
    return { count }
  }
}
