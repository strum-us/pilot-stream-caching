import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Field, ObjectType } from 'type-graphql'

export enum Permission {
  fullaccess = 'fullaccess',
  view = 'view',
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class Admin extends Model<Admin> {
  @Field()
  @Column({
    primaryKey: true,
  })
  id!: string

  @Field({ description: 'User account unique' })
  @Column({ allowNull: false })
  accountId!: string

  @Field()
  @Column({
    allowNull: false,
    type: DataType.ENUM('fullaccess', 'view'),
  })
  permission!: Permission

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
