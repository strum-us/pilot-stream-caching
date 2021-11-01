import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import FeedbackIssue, { FeedbackIssueType } from './feedbackIssue'
import { Field, Int, ObjectType } from 'type-graphql'

import User from './user'

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackCommnent extends Model<FeedbackCommnent> {
  @Field((type) => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field((type) => Int)
  @ForeignKey(() => User)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  creatorId!: number

  @Field((type) => Int)
  @ForeignKey(() => FeedbackIssue)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  issueId!: number

  @Field()
  @Column({ type: DataType.TEXT })
  content!: string

  @Field()
  @Column({
    type: DataType.ENUM('text', 'audio'),
  })
  type!: FeedbackIssueType

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

  @Field()
  @BelongsTo(() => User, 'createId')
  creator!: User

  // @Field()
  // @BelongsTo(() => FeedbackIssue, 'issueId')
  // issue!: FeedbackIssue
}
