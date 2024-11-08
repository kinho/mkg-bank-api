import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'

import { Account } from '../account/account.schema'
import { Node } from '../relay'
import { User } from '../user'

@ObjectType({ implements: Node })
export class Transaction implements Node {
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
