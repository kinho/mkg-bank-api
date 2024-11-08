import { Max, Min } from 'class-validator'
import {
  ConnectionArguments as ConnectionArgumentsInterface,
  PageInfo as PageInfoInterface,
} from 'graphql-relay'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InterfaceType, ObjectType } from 'type-graphql'

@InterfaceType()
export abstract class Node {
  @Field(() => ID)
  _id!: ObjectId
}

@ArgsType()
export class ConnectionArguments implements ConnectionArgumentsInterface {
  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => String, { nullable: true })
  before?: string

  @Min(1)
  @Max(50)
  @Field(() => Number, { nullable: true, defaultValue: 10 })
  first?: number = 10

  @Min(1)
  @Max(50)
  @Field(() => Number, { nullable: true })
  last?: number
}

@ObjectType()
export class PageInfo implements PageInfoInterface {
  @Field(() => String, { nullable: true })
  endCursor: string | null = null

  @Field(() => Boolean, { nullable: true })
  hasNextPage: boolean = false

  @Field(() => Boolean, { nullable: true })
  hasPreviousPage: boolean = false

  @Field(() => String, { nullable: true })
  startCursor: string | null = null
}
