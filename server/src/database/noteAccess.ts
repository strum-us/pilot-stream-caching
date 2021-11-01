import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'

import FeedbackNote from './feedbackNote'
import User from './user'

export enum NoteAccessPermission {
  none,
  creator,
  collaborator,
  assignee,
}

registerEnumType(NoteAccessPermission, {
  name: 'NoteAccessPermission',
  description: 'member type with permission',
})

@InputType()
export class NoteAccessInput {
  @Field({ nullable: true })
  noteId?: string // this need to belong to here, we can use it not only creating but also updating.
  @Field(() => NoteAccessPermission, { nullable: true })
  permission?: NoteAccessPermission
  @Field({ nullable: true })
  updatedAt?: Date
  @Field({ nullable: true })
  email?: string
  @Field({ nullable: true })
  accessToken?: string
  @Field({ nullable: true })
  passcode?: string

  existed() {
    const { noteId, email, permission, updatedAt, accessToken, passcode }: NoteAccessInput = this
    let values = { }
    values = noteId ? { ...values, noteId } : values
    values = email ? { ...values, email } : values
    values = permission ? { ...values, permission } : values
    values = accessToken ? { ...values, accessToken } : values
    values = passcode ? { ...values, passcode } : values
    values = updatedAt ? { ...values, updatedAt } : values
    return values
  }
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class NoteAccess extends Model<NoteAccess> {
  @Field((type) => Int)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Field({ nullable: true })
  @ForeignKey(() => User)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  noteId!: string

  @Field({ nullable: true })
  @ForeignKey(() => User)
  @Column({ allowNull: false, onDelete: 'CASCADE' })
  userId?: string

  @Field({ nullable: true })
  @Column
  email?: string

  @Field({ nullable: true })
  @Column
  passcode?: string

  @Field({ nullable: true })
  @Column
  accessToken?: string

  @Field(() => NoteAccessPermission, { nullable: true, defaultValue: NoteAccessPermission.none })
  @Column({
    type: DataType.ENUM(...Object.keys(NoteAccessPermission)),
  })
  permission?: NoteAccessPermission

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

  @Field({ nullable: true })
  @BelongsTo(() => User, 'noteId')
  note!: FeedbackNote

  @Field({ nullable: true })
  @BelongsTo(() => User, 'userId')
  user?: User
}
