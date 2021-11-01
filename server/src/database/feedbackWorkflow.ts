import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Field, Int, ObjectType } from 'type-graphql'

import FeedbackNote from './feedbackNote'
import Project from './Project'
import User from './user'

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class FeedbackWorkflow extends Model<FeedbackWorkflow> {
  @Field(type => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field()
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  creatorId!: string

  @Field({ nullable: false})
  @Column({ allowNull: false })
  settings!: string

  @Field()
  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  createdAt!: Date

  @Field()
  @BelongsTo(() => User, 'creatorId')
  creator!: User
}
