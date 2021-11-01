import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql'

@ObjectType()
export class Notification {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Date)
  date!: Date;
}

export type NotificationPayload = {
  id: number;
  message?: string;
}

export enum NotificationUpdateTypes {
  created,
  deleted,
  updated,
}

registerEnumType(NotificationUpdateTypes, {
  name: 'NotificationUpdateTypes',
})

export enum SubItemUpdateType {
  upsert = 'upsert',
  delete = 'delete',
}

registerEnumType(SubItemUpdateType, {
  name: 'SubItemUpdateType',
})

@InputType()
export class ListingOptions {
  @Field({ nullable: true })
  offset?: number
  @Field({ nullable: true })
  limit?: number
  @Field({ nullable: true })
  order?: string
  @Field({ nullable: true })
  orderBy?: string
}
