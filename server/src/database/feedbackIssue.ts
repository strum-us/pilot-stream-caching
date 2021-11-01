import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import FeedbackSnapshot, { UpdateFeedbackSnapshotOptions } from './feedbackSnapshot'
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'

import FeedbackActionRecord from './feedbackActionRecord'
import FeedbackCommnent from './feedbackComment'
import FeedbackNote from './feedbackNote'
import FeedbackSource from './feedbackSource'
import User from './user'

export enum FeedbackIssueType {
  text = 'text',
  audio = 'audio',
}

@InputType()
export class FeedbackIssueInput {
  @Field({ nullable: true, description: 'Only use for creation' })
  noteId?: string
  @Field(() => Int, { nullable: true, description: 'Only use for creation' })
  sourceId?: number
  @Field({ nullable: true })
  type?: FeedbackIssueType
  @Field({ nullable: true })
  markerId?: string
  @Field({ nullable: true })
  content?: string
  @Field({ nullable: true })
  thumbnail?: string
  @Field({ nullable: true })
  imageUrl?: string
  @Field({ nullable: true })
  order?: number
  @Field({ nullable: true })
  position?: string
  @Field({ nullable: true })
  snapshotOptions?: UpdateFeedbackSnapshotOptions
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackIssue extends Model<FeedbackIssue> {
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

  @Field((type) => Int)
  @ForeignKey(() => FeedbackSource)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  sourceId!: number

  @Field()
  @ForeignKey(() => FeedbackNote)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  noteId!: string

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  content?: string

  @Field({ nullable: true })
  @Column
  thumbnail?: string

  @Field({ nullable: true })
  @Column({ allowNull: true })
  imageUrl?: string

  @Field({ nullable: true })
  @Column({ allowNull: true })
  markerId?: string

  @Field({ nullable: true })
  @Column({
    type: DataType.ENUM('text', 'audio'),
  })
  type!: FeedbackIssueType

  @Field({ nullable: false })
  @Column({ allowNull: false })
  order?: number

  @Field()
  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  createdAt!: Date

  @Field()
  @Column({
    allowNull: true,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  updatedAt!: Date

  @Field({ nullable: true })
  @BelongsTo(() => User, 'creatorId')
  creator!: User

  @Field()
  @BelongsTo(() => FeedbackNote, 'noteId')
  note!: FeedbackNote

  @Field()
  @BelongsTo(() => FeedbackSource, 'sourceId')
  source!: FeedbackSource

  @Field(() => FeedbackCommnent, { nullable: true })
  @HasMany(() => FeedbackCommnent)
  comments?: FeedbackCommnent[]

  @Field(() => FeedbackSnapshot, { nullable: true })
  @HasOne(() => FeedbackSnapshot)
  snapshot?: FeedbackSnapshot

  @Field(() => FeedbackActionRecord, { nullable: true })
  @HasOne(() => FeedbackActionRecord)
  actionRecord?: FeedbackActionRecord
}
