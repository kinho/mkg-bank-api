import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'

import { User } from '@modules/user'

import { Account } from '../account/account.schema'

@ObjectType()
export class Transaction {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field(() => String)
  @prop({ type: String, required: true, unique: true })
  public number!: string

  @Field(() => Account)
  @prop({ ref: () => Account, required: true })
  public fromAccount!: Ref<Account>

  @Field(() => Account)
  @prop({ ref: () => Account, required: true })
  public toAccount!: Ref<Account>

  @Field(() => Number)
  @prop({ type: Number, required: true })
  public amount!: number

  @Field(() => User)
  @prop({ ref: () => User, required: true })
  public createdBy!: Ref<User>

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, required: true, default: Date.now })
  public createdAt!: Date
}

export const TransactionModel = getModelForClass(Transaction)
