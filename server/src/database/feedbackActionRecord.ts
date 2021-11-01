import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, Int, ObjectType } from 'type-graphql'

import FeedbackIssue from './feedbackIssue'
import FeedbackSource from './feedbackSource'

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackActionRecord extends Model<FeedbackActionRecord> {
  @Field((type) => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field((type) => Int)
  @ForeignKey(() => FeedbackIssue)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  issueId!: number

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  content?: string

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  title?: string

  @Field({ nullable: false })
  @Column({ type: DataType.TEXT })
  key?: string

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
  @BelongsTo(() => FeedbackIssue, 'issueId')
  issue!: FeedbackIssue
}
