import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, ObjectType } from 'type-graphql'

import User from './user'

export enum ActivityType {
  login = 'login',
  logout = 'logout',
  invite = 'invite',
  openHelp = 'openHelp',
  openFeedback = 'openFeedback',
  openPricing = 'openPricing',
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class UserLog extends Model<UserLog> {
  @Field()
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field({ nullable: true })
  @ForeignKey(() => User)
  @Column({ allowNull: true })
  userId!: string

  @Field()
  @Column({
    allowNull: true,
    type: DataType.ENUM(...Object.keys(ActivityType)),
  })
  type!: ActivityType

  @Field({ nullable: true })
  @Column({ allowNull: true })
  data?: string

  @Field()
  @Column({
    allowNull: false,
    defaultValue: DataType.NOW,
    type: DataType.DATE(3),
  })
  createdAt!: Date
}
