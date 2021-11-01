import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload } from './notification.type'
import { Context } from 'src/types'
import Project from 'src/database/project'
import sequelize from 'src/database/database'
import { Count, ListingOptions } from './options'

@InputType()
class CreateProjectOptions {
  @Field({ nullable: true })
  userId?: string

  @Field()
  title?: string
}

@Resolver()
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg('options') options: CreateProjectOptions,
    @Ctx() { db } : Context,
  ): Promise<Project> {
    console.log({ createProject: options })
    const { title, userId } = options
    if (!userId) throw new Error('User is not loggined')
    if (!title) throw new Error('Title is not given')
    if (title?.trim().length <= 2) throw new Error('Title has to be longer than 2 letters')
    return await db.getRepository(Project).create({ creatorId: userId, title })
  }

  @Query(() => [Project])
  async projectsList(
    @Arg('options') options: ListingOptions,
    @Ctx() ctx : Context,
  ): Promise<Project[]> {
    const { offset, limit, userId } = options
    const res = await ctx.db.getRepository(Project).findAll({
      where: { creatorId: userId ?? ctx.userId },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    })
    return res
  }

  @Mutation(() => Count)
  async deleteProjects(
    @Arg('ids', (type) => [Int]) ids: number[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(Project).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async projectsCount(@Ctx() { db }: Context) {
    const count = await db.getRepository(Project).count()
    return { count }
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  projectChanged(
    @Arg('title') title: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() }
  }
}
