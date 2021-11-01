import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

export enum UserStatus {
  visitor = 'visitor',
  alive = 'alive',
  inactive = 'inactive',
  paused = 'paused',
  blocked = 'blocked',
  deleted = 'deleted',
}
registerEnumType(UserStatus, {
  name: 'UserStatus',
})

@InputType()
export class UserInput {
  @Field()
  email?: string
  @Field()
  password?: string
  @Field({ nullable: true })
  firstName?: string
  @Field({ nullable: true })
  lastName?: string
  @Field({ nullable: true })
  photo?: string
  @Field({ nullable: true })
  language?: string
  @Field({ nullable: true })
  token?: string
  @Field({ nullable: true })
  oauthToken?: string
  @Field({ nullable: true })
  oauthProvider?: string
  @Field({ nullable: true })
  onboarding?: string
  @Field(() => UserStatus, { nullable: true })
  userStatus?: UserStatus
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class User extends Model<User> {
  @Field()
  @Column({
    primaryKey: true,
  })
  id!: string

  @Field({ description: 'User account unique' })
  @Column({ allowNull: false })
  accountId!: string

  @Field({ nullable: true })
  @Column({ allowNull: false })
  email!: string

  @Column({
    allowNull: true,
  })
  password!: string

  @Field({ nullable: true })
  @Column
  photo?: string

  @Field({ defaultValue: 'none', nullable: true })
  @Column
  firstName?: string

  @Field({ defaultValue: 'none', nullable: true })
  @Column
  lastName?: string

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  oauthToken?: string

  @Field({ nullable: true, description: 'Provide like google or facebook' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  oauthProvider?: string

  @Field({ nullable: true, description: 'Token for authentication' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  token?: string

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  language?: string

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  onboarding?: string

  @Field({ nullable: true })
  @Column({
    allowNull: true,
    type: DataType.ENUM(...Object.keys(UserStatus)),
  })
  userStatus!: UserStatus

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

  isActive() {
    const inActive: UserStatus[] = [UserStatus.visitor]

    return inActive.indexOf(this.userStatus) === -1
  }
}
