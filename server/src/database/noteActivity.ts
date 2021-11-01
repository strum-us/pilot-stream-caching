import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

import FeedbackIssue from './feedbackIssue'
import FeedbackNote from './feedbackNote'
import FeedbackSource from './feedbackSource'
import User from './user'

@InputType()
export class NoteActivityInput {
  @Field({ nullable: true })
  thumbnail?: string

  existed() {
    const { thumbnail }: NoteActivityInput = this
    let values = {}
    values = thumbnail ? { ...values, thumbnail } : values
    return values
  }
}

export enum ActionEnum {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted',
  moved = 'moved',
  completed = 'completed',
  added = 'added',
}

registerEnumType(ActionEnum, {
  name: 'ActionEnum',
  description: 'Type of activity action',
})

export enum ActivityTargetEnum {
  note = 'note',
  source = 'source',
  issue = 'issue',
}

registerEnumType(ActivityTargetEnum, {
  name: 'ActivityTargetEnum',
  description: 'Type of activity target',
})

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class NoteActivity extends Model<NoteActivity> {
  @Field((type) => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field()
  @ForeignKey(() => User)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  userId!: string

  @Field()
  @ForeignKey(() => FeedbackNote)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  noteId!: string

  @Field({ nullable: true })
  @ForeignKey(() => FeedbackSource)
  @Column({ allowNull: true, onDelete: 'CASCADE' })
  sourceId?: number

  @Field({ nullable: true })
  @ForeignKey(() => FeedbackIssue)
  @Column({ allowNull: true, onDelete: 'CASCADE' })
  issueId?: number

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  thumbnail?: string

  @Field({ nullable: true })
  @Column
  comment!: string

  @Field({ nullable: true })
  @Column({ allowNull: true })
  label?: string

  @Field(() => ActionEnum, { nullable: true })
  @Column({
    type: DataType.ENUM(...Object.keys(ActionEnum)),
  })
  action?: ActionEnum

  @Field(() => ActivityTargetEnum, { nullable: true })
  @Column({
    type: DataType.ENUM(...Object.keys(ActivityTargetEnum)),
  })
  activityTarget?: ActivityTargetEnum

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
  @BelongsTo(() => User, 'userId')
  user!: User

  @Field({ nullable: true })
  @BelongsTo(() => FeedbackNote, 'noteId')
  note!: FeedbackNote
}
