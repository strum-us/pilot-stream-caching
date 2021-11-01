import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

export enum UnitStripVersion {
  NotSpecified = 'notSpecified',
  V1_0 = 'v1_0'
}
registerEnumType(UnitStripVersion, {
  name: 'UnitStripVersion',
})

@InputType()
export class CreateAnnotationOptions {
  @Field({ nullable: false })
  sourceId!: string
  @Field({ nullable: false })
  data!: string
  @Field()
  version!: UnitStripVersion
}

@InputType()
export class SetAnnotationsOptions {
  @Field({ nullable: false })
  sourceId!: string
  @Field({ nullable: false })
  updatedAt!: number
  @Field(() => [AnnotationsInput], { nullable: false })
  annotations!: AnnotationsInput[]
}
@InputType()
export class AnnotationsInput {
  @Field({ nullable: false })
  id!: string
  @Field({ nullable: false })
  data!: string
  @Field()
  version!: UnitStripVersion
}

@InputType()
export class UpdateAnnotationOptions {
  @Field({ nullable: false })
  id!: number
  @Field({ nullable: false })
  data!: string
}

@ObjectType()
@Table({ freezeTableName: true, underscored: true, timestamps: false })
export default class Annotation extends Model<Annotation> {
  @Field()
  @Column({ allowNull: false, primaryKey: true })
  id!: string

  @Field()
  @Column({ type: DataType.TEXT, allowNull: false })
  data!: string

  @Field()
  @Column
  sourceId!: string

  @Field(() => UnitStripVersion)
  @Column({
    type: DataType.ENUM(UnitStripVersion.NotSpecified, UnitStripVersion.V1_0),
  })
  version!: UnitStripVersion

  @Field()
  @Column({ type: DataType.BIGINT })
  updatedAt!: number
}
