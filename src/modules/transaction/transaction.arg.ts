import {
  IsDecimal,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { Transaction } from '@modules/transaction'
import {
  STRING_MAX_LENGTH,
  STRING_MIN_LENGTH,
} from '@modules/utils/validation.default'

@InputType()
export class CreateTransactionArgs {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String)
  fromAccountNumber!: string

  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String)
  toAccountNumber!: string

  @Min(0.01)
  @IsDecimal({ decimal_digits: '2' })
  @Field(() => Number)
  amount!: number
}

@ArgsType()
export class ListTransactionsArgs {
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
export class ListTransactionsResponse {
  @Field(() => Number)
  count!: number

  @Field(() => [Transaction])
  data!: Transaction[]
}
