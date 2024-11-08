import { IsDecimal, MaxLength, Min, MinLength } from 'class-validator'
import { Connection } from 'graphql-relay'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { ConnectionArguments, PageInfo } from '@modules/relay'
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
export class ListTransactionsArgs extends ConnectionArguments {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  number?: string
}

@ObjectType()
export class TransactionEdge {
  @Field(() => Transaction)
  node!: Transaction

  @Field(() => String)
  cursor!: string
}

@ObjectType()
export class TransactionConnection implements Connection<Transaction> {
  @Field(() => [TransactionEdge])
  edges!: TransactionEdge[]

  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => Number)
  totalCount!: number
}
