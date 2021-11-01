import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, InputType, Int, ObjectType } from 'type-graphql'

import FeedbackIssue from './feedbackIssue'
import { SubItemUpdateType } from 'src/graphql/notification.type'

@InputType()
export class UpdateFeedbackSnapshotOptions {
  @Field({ nullable: true })
  position?: string
  // add / delete / update
  @Field((type) => SubItemUpdateType)
  type!: SubItemUpdateType
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackSnapshot extends Model<FeedbackSnapshot> {
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
  position!: string

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
}
