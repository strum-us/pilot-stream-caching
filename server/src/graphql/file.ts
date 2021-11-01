import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, Root, Subscription } from 'type-graphql'
import { Notification, NotificationPayload } from './notification.type'
import { Context } from 'src/types'
import File, { FileInputDescription } from 'src/database/file'
import sequelize from 'src/database/database'
import { Count } from './options'
import { IsInt } from 'sequelize-typescript'
import User from 'src/database/user'


@InputType()
class FileListingOptions {
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field({ nullable: false })
  ownerId!: string
}


@InputType()
class UpdateFileOptions {
  @Field({ nullable: false })
  fileKey!: string
  @Field({ nullable: true })
  displayName?: string
}

@Resolver()
export class FileResolver {
  // @Mutation(() => File)
  // createFile(
  //   @Arg('input') input: CreateFileOptions,
  //   @Ctx() { db, userId } : Context,
  // ): Promise<File> {
  //   const { sourceId, data, version } = input
  //   if (!userId) throw new Error('User is not loggined')
  //   const repo = db.getRepository(File)
  //   return repo.create({ sourceId, data, version, creatorId: userId })
  // }

  @Mutation(() => File)
  async addFiles(
    @Arg('inputs', type => [FileInputDescription]) inputs: FileInputDescription[],
    @Ctx() { db, userId } : Context,
  ): Promise<File> {
    if (!userId) throw new Error('User is not loggined')
    const urls = inputs.map((input) => ({ ...input, url: input.url.startsWith('blob:') ? '' : input.url }))
    console.log({ urls: urls })
    const files = urls.map((url) =>  { return { ...url, originUrl: url.url } })
    try {
      return await sequelize.getRepository(File).bulkCreate(files)
    } catch (err) {
      throw err
    }
  }

  @Mutation(() => File)
  async setFileUploaded(
    @Arg('fileKey') fileKey: string,
    @Arg('url') url: string,
    @Ctx() { db, userId } : Context,
  ) {
    try {
      const fileDb = db.getRepository(File)
      const file = await fileDb.findOne({ where: { fileKey }})
      console.log('setFileUploaded', { fileKey, url, file })
      if (!file) throw Error('Cannot find the file')
      if (!file?.originUrl) {
        await fileDb.update({ url, originUrl: url }, { where: { id: file.id } })
      } else {
        await fileDb.update({ url }, { where: { id: file.id }})
      }
      file.url = url

      // // file upload finished, then subscribe to participants
      // pubsub.publish(SessionSubscription.onAddFile, {
      //   sessionId: sessionId,
      //   userId: userId,
      //   onAddFile: [file],
      // })
      return file
    } catch (err) {
      console.error('setFileUpdated', { fileKey, err })
      return null
    }

  }



  @Query(() => [File])
  filesList(
    @Arg('options') options: FileListingOptions,
    @Ctx() { db } : Context,
  ): Promise<File[]> {
    const { offset, limit, ownerId } = options
    const repo = db.getRepository(File)

    //calculating
    return repo.findAll({ 
      where: { ownerId }, 
      order: [['updatedAt', 'DESC' ]],
      offset, limit,
    })
  }

  @Query(() => File)
  async fileDetail(
    @Arg('id') id: number,
    @Ctx() { db, userId } : Context,
  ): Promise<File> {
    const repo = db.getRepository(File)
    const file = await repo.findOne({ 
      where: { id },
      include: [db.getRepository(User)],
    })
    return file
  }

  @Mutation(() => File)
  async updateFile(
    @Arg('options') options: UpdateFileOptions,
    @Ctx() { db } : Context,
  ) {
    const { fileKey, displayName } = options
    const repo = db.getRepository(File)
    return await repo.update({ 
      displayName
    }, {
        where: {
          fileKey,
      }})
  }

  @Mutation(() => Count)
  async deleteFiles(
    @Arg('ids', type => [String]) ids: string[],
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(File).destroy({ where: { id: ids }})
    return { count }
  }

  @Query(() => Count)
  async filesCount(
    @Arg('sourceId' ) sourceId: number,
    @Ctx() { db }: Context,
  ) {
    const count = await db.getRepository(File).count({ where: { sourceId }})
    return { count }
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  fileChanged(
    @Arg('title') title: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() }
  }
}
