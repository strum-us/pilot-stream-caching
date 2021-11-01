import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

import User from './user'

export enum NoteProgress {
  draft = 'draft',
  published = 'published',
  working = 'working',
  done = 'done',
  archived = 'archived'
}

registerEnumType(NoteProgress, {
  name: 'NoteProgress',
  description: 'Type of source file',
})

@InputType()
export class FeedbackNoteInput {
  @Field({ nullable: true })
  title?: string
  @Field({ nullable: true })
  thumbnail?: string
  @Field({ nullable: true })
  description?: string
  @Field(() => NoteProgress, { nullable: true })
  progress?: NoteProgress
  @Field({ nullable: true })
  publishedAt?: Date

  existed() {
    const { title, thumbnail, description, progress, publishedAt } = this
    let values = { }
    values = title ? { ...values, title } : values
    values = thumbnail ? { ...values, thumbnail } : values
    values = description ? { ...values, description } : values
    values = progress ? { ...values, progress } : values
    values = publishedAt ? { ...values, publishedAt } : values
    return values
  }
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackNote extends Model<FeedbackNote> {
  @Field()
  @Column({
    primaryKey: true,
  })
  id!: string

  @Field({ nullable: true })
  @ForeignKey(() => User)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  creatorId!: string

  @Field((type) => Int, { nullable: true })
  @Column({ allowNull: true })
  projectId?: number

  @Field({ nullable: true })
  @BelongsTo(() => User, 'creatorId')
  creator!: User

  @Field({ nullable: true })
  @Column
  title!: string

  @Field({ nullable: true })
  @Column
  thumbnail?: string

  @Field({ nullable: true })
  @Column
  description?: string

  @Field(() => NoteProgress, { nullable: true, defaultValue: NoteProgress.draft })
  @Column({
    type: DataType.ENUM(...Object.keys(NoteProgress)),
  })
  progress?: NoteProgress

  @Field({ nullable: true })
  @Column({
    allowNull: true,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  publishedAt?: Date

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

  @Field({ nullable: true, description: 'will be calcuated when querying' })
  numberOfIssues?: number

  @Field({ nullable: true, description: 'will be calcuated when querying' })
  numberOfSources?: number

  @Field({ nullable: true, description: 'will be calcuated when querying' })
  lastSourceId?: number
}
