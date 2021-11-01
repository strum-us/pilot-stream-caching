import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, Int, ObjectType } from 'type-graphql'

import User from './user'

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class Project extends Model<Project> {
  @Field((type) => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field()
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  creatorId!: string

  @BelongsTo(() => User, 'creatorId')
  creator?: User

  @Field({ nullable: true })
  @Column
  title?: string

  @Field({ nullable: true })
  @Column
  description?: string

  @Field((type) => Int, { nullable: true })
  @Column
  numberOfComments?: number

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
