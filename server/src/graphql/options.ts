import { ClassType, Field, InputType, Int, ObjectType } from 'type-graphql'

import { NotificationUpdateTypes } from './notification.type'

@InputType()
export class ListingOptions {
  @Field()
  userId!: string
  @Field(() => Int)
  offset?: number
  @Field(() => Int)
  limit?: number
}

// export function QueryListingOptions() {
//   @ObjectType({ isAbstract: true })
//   abstract class ListingOptionsClass {
//     @Field({ nullable: true })
//     offset?: number;
//     @Field({ nullable: true })
//     limit?: number;
//     @Field({ nullable: true })
//     order?: string;
//     @Field({ nullable: true })
//     orderBy?: string;
//   }
//   return ListingOptionsClass
// }

@ObjectType()
export class Count {
  @Field(() => Int)
  count!: number
}

@InputType()
export class SearchOptions {
  @Field()
  keyword!: string
  @Field(() => Int, { nullable: true })
  offset?: number
  @Field(() => Int, { nullable: true })
  limit?: number
}

export function SubscriptionNotification<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class SubscriptionNotificationClass {
    @Field(() => TItemClass)
    item!: TItem;
    @Field()
    id!: string;
    @Field()
    userId!: string;
    @Field(() => Date)
    date!: Date;
  }
  return SubscriptionNotificationClass
}

export function SubscriptionNotificationListing<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class SubscriptionNotificationClass {
    @Field(() => [String])
    ids!: string[];
    @Field()
    userId!: string;
    @Field(() => Date)
    date!: Date;
    @Field(() => [TItemClass], { nullable: true })
    items?: TItem[];
    @Field(() => NotificationUpdateTypes)
    type!: NotificationUpdateTypes;
  }
  return SubscriptionNotificationClass
}
