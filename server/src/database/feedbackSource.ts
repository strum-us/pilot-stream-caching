import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

import FeedbackIssue from './feedbackIssue'
import FeedbackNote from './feedbackNote'
import File from './file'
import User from './user'

export enum SourceType {
  video = 'video',
  file = 'file',
  image = 'image',
  board = 'board',
}

registerEnumType(SourceType, {
  name: 'SourceType',
  description: 'Type of source file',
})

export enum TaskStatus {
  requestTask = 'requestTask',
  todo = 'todo',
  inProgress = 'inProgress',
  requestApproval = 'requestApproval',
  approvedCompletion = 'approvedCompletion',
  declineTask = 'declineTask',
  approvedDeclination = 'approvedDeclination',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'task status',
})

@InputType()
export class FeedbackSourceInput {
  @Field({ nullable: true, description: 'either noteId or referenceSourceId should be given for creation' })
  noteId?: string
  @Field(() => Int, { nullable: true, description: 'either noteId or referenceSourceId should be given for creation' })
  referenceSourceId?: number
  @Field({ nullable: true })
  title?: string
  @Field({ nullable: true })
  thumbnail?: string
  @Field({ nullable: true })
  url?: string
  @Field({ nullable: true })
  imageUrl?: string
  @Field(() => Int, { nullable: true })
  fileSize?: number
  @Field({ nullable: true })
  label?: string
  @Field(() => TaskStatus, { nullable: true })
  taskStatus?: TaskStatus
  @Field({ nullable: true })
  order?: number

  existed() {
    const { title, thumbnail, imageUrl, label, taskStatus, fileSize, url, referenceSourceId, order }: FeedbackSourceInput = this
    let values = {}
    values = title ? { ...values, title } : values
    values = thumbnail ? { ...values, thumbnail } : values
    values = url ? { ...values, url } : values
    values = fileSize ? { ...values, fileSize } : values
    values = imageUrl ? { ...values, imageUrl } : values
    values = label ? { ...values, label } : values
    values = taskStatus ? { ...values, taskStatus } : values
    values = referenceSourceId ? { ...values, referenceSourceId } : values
    values = order ? { ...values, order } : values
    return values
  }

  responseUpdate(res: any) {
    const { title, thumbnail, imageUrl, label, taskStatus, fileSize, url, referenceSourceId }: FeedbackSourceInput = this

    res.title = title ? title : res.title
    res.thumbnail = thumbnail ? thumbnail : res.thumbnail
    res.url = url ? url : res.url
    res.fileSize = fileSize ? fileSize : res.fileSize
    res.imageUrl = imageUrl ? imageUrl : res.imageUrl
    res.label = label ? label : res.label
    res.taskStatus = taskStatus ? taskStatus : res.taskStatus
    res.referenceSourceId = referenceSourceId ? referenceSourceId : res.referenceSourceId
    res.updatedAt = Date.now()
    return res
  }
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackSource extends Model<FeedbackSource> {
  @Field((type) => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field()
  @ForeignKey(() => User)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  creatorId!: string

  @Field()
  @ForeignKey(() => FeedbackNote)
  @Column({ allowNull: true, onDelete: 'CASCADE' })
  noteId?: string

  @Field(() => Int, { nullable: true, description: 'Original source that it replies from' })
  @ForeignKey(() => FeedbackSource)
  @Column({ allowNull: true, onDelete: 'CASCADE' })
  referenceSourceId?: number

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  thumbnail?: string

  @Field({ nullable: true })
  @Column({ allowNull: true })
  imageUrl?: string

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  title!: string

  @Field({ nullable: true })
  @Column
  url?: string

  @Field(() => Int, { nullable: true })
  @Column
  fileSize?: number

  @Field({ nullable: true })
  @Column({ allowNull: true })
  label?: string

  @Field(() => TaskStatus, { nullable: true, defaultValue: TaskStatus.requestTask })
  @Column({
    type: DataType.ENUM(...Object.keys(TaskStatus)),
  })
  taskStatus?: TaskStatus

  @Field(() => SourceType, { nullable: true })
  @Column({
    type: DataType.ENUM(...Object.keys(SourceType)),
  })
  type?: SourceType

  @Field({ nullable: false })
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  order!: number

  // @ForeignKey(() => File)
  // @Column({ allowNull: true })
  // @Field({ nullable: true})
  // fileId?: number

  @Field()
  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  createdAt!: Date

  @Field()
  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  updatedAt!: Date

  @Field({ nullable: true })
  @BelongsTo(() => User, 'creatorId')
  creator!: User

  @Field({ nullable: true })
  @BelongsTo(() => FeedbackNote, 'noteId')
  note!: FeedbackNote

  // @Field()
  // @BelongsTo(() => File, 'fileId')
  // file!: File

  @Field(() => [FeedbackIssue], { nullable: true })
  @HasMany(() => FeedbackIssue)
  issues!: FeedbackIssue[]
}
