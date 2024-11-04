import { IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, Float, ID, InputType, ObjectType } from 'type-graphql'

import {
  STRING_MAX_LENGTH,
  STRING_MIN_LENGTH,
} from '@modules/utils/validation.default'

import { Account } from './account.schema'

@InputType()
export class UpdateAccountArgs {
  @IsMongoId()
  @Field(() => ID)
  _id!: ObjectId

  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  number?: string | null
}

@ArgsType()
export class ListAccountsArgs {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  number?: string

  @Min(1)
  @Max(50)
  @Field(() => Number, { nullable: true, defaultValue: 10 })
  limit?: number = 10

  @Min(0)
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  offset?: number = 0
}

@ObjectType()
export class AccountResponse extends Account {
  @Field(() => Float)
  balance!: number
}

@ObjectType()
export class ListAccountsResponse {
  @Field(() => Number)
  count!: number

  @Field(() => [AccountResponse])
  data!: AccountResponse[]
}
