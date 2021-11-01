import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload } from './notification.type'
import { Context } from 'src/types'
import Annotation, { CreateAnnotationOptions, SetAnnotationsOptions, UpdateAnnotationOptions } from 'src/database/annotation'
import sequelize from 'src/database/database'
import { Count } from './options'
import { IsInt } from 'sequelize-typescript'
import User from 'src/database/user'

@InputType()
class AnnotationListingOptions {
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field({ nullable: false })
  sourceId!: string
}

@Resolver()
export class AnnotationResolver {
  @Mutation(() => Annotation)
  createAnnotation(
    @Arg('input') input: CreateAnnotationOptions,
    @Ctx() { db, userId } : Context,
  ): Promise<Annotation> {
    const { sourceId, data, version } = input
    if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(Annotation)
    return repo.create({ sourceId, data, version, creatorId: userId })
  }

  @Mutation(() => Boolean)
  async setAnnotations(
    @Arg('input') input: SetAnnotationsOptions,
    @Ctx() { db, userId } : Context,
  ) {
    const { sourceId, updatedAt, annotations } = input
    if (!userId) throw new Error('User is not loggined')
    const repo = db.getRepository(Annotation)

    const transaction = await sequelize.transaction()
    try {
      const updated: (Annotation | null)[] = await Promise.all(annotations.map(async (adata) => {
        try {
          const annotation: Annotation | null = await repo.findOne({
            where: { sourceId, id: adata.id },
          })

          if (!annotation) {
            return await repo.create({ ...adata, sourceId, updatedAt }, { transaction })
          } else {
            if (annotation.updatedAt < updatedAt) {
              annotation.data = adata.data
              annotation.updatedAt = updatedAt
              await annotation.save({ transaction })
              return annotation
            }
          }
        } catch (err) {
          throw err
        }
      }))

      await transaction.commit()
    } catch (err) {
      // console.error('serAnnotations error', { err })
      await transaction.rollback()
      throw err
    }
    return true
  }

  @Query(() => [Annotation])
  annotationsList(
    @Arg('options') options: AnnotationListingOptions,
    @Ctx() { db } : Context,
  ): Promise<Annotation[]> {
    const { offset, limit, sourceId } = options
    const repo = db.getRepository(Annotation)

    // calculating
    return repo.findAll({
      where: { sourceId },
      order: [['updatedAt', 'DESC']],
      offset,
      limit,
    })
  }

  @Query(() => Annotation)
  async annotationDetail(
    @Arg('id') id: number,
    @Ctx() { db, userId } : Context,
  ): Promise<Annotation> {
    const repo = db.getRepository(Annotation)
    const annotation = await repo.findOne({
      where: { id },
      include: [db.getRepository(User)],
    })
    return annotation
  }

  @Mutation(() => Annotation)
  async updateAnnotation(
    @Arg('options') options: UpdateAnnotationOptions,
    @Ctx() { db } : Context,
  ) {
    const { id, data } = options
    const repo = db.getRepository(Annotation)
    return await repo.update({
      data,
    }, {
      where: {
        id,
      },
    })
  }

  @Mutation(() => Count)
  async deleteAnnotations(
    @Arg('ids', (type) => [String]) ids: string[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(Annotation).destroy({ where: { id: ids } })
    return { count }
  }

  @Query(() => Count)
  async annotationsCount(
    @Arg('sourceId') sourceId: number,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(Annotation).count({ where: { sourceId } })
    return { count }
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  annotationChanged(
    @Arg('title') title: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() }
  }
}
