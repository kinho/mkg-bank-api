import { IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator'
import { Connection } from 'graphql-relay'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, Float, ID, InputType, ObjectType } from 'type-graphql'

import { ConnectionArguments, PageInfo } from '@modules/relay'
import {
  STRING_MAX_LENGTH,
  STRING_MIN_LENGTH,
} from '@modules/utils/validation.default'

import { Account } from './account.schema'

@ArgsType()
export class ListAccountsArgs extends ConnectionArguments {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  number?: string
}

@ObjectType()
export class AccountEdge {
  @Field(() => Account)
  node!: Account

  @Field(() => String)
  cursor!: string
}

@ObjectType()
export class AccountConnection implements Connection<Account> {
  @Field(() => [AccountEdge])
  edges!: AccountEdge[]

  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => Number)
  totalCount!: number
}
