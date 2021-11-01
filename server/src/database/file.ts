import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript'
import { Field, InputType, ObjectType } from 'type-graphql'

import User from './user'

@InputType()
export class FileInputDescription {
  @Field({ nullable: false })
  fileKey!: string
  @Field({ nullable: false })
  url!: string
  @Field({ nullable: true })
  displayName?: string
  @Field({ nullable: true })
  thumbnail?: string
  @Field({ nullable: true })
  sizeByte?: number
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: true })
export default class File extends Model<File> {
  @Field()
  @Column({ autoIncrement: true, primaryKey: true })
  id!: number

  @Field()
  @Column({ allowNull: false })
  displayName!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
  })
  url!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
  })
  originUrl!: string

  @Field({ nullable: true })
  @Column
  fileKey!: string  // key for uploading

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
  })
  thumbnail?: string

  @Field({ nullable: true })
  @Column
  sizeByte!: number

  @Field()
  @ForeignKey(() => User)
  @Column
  userId!: string

  @BelongsTo(() => User, 'userId')
  owner!: User

  @Field()
  @CreatedAt
  createdAt!: Date

  @Field()
  @UpdatedAt
  updatedAt!: Date
}
