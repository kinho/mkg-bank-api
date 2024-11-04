import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'

import { User } from '@modules/user'

@ObjectType()
export class Account {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field(() => String)
  @prop({ type: String, required: true, unique: true })
  public number!: string

  @Field(() => User)
  @prop({ ref: () => User })
  public owner!: Ref<User>

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, required: true, default: Date.now })
  public createdAt!: Date
}

export const AccountModel = getModelForClass(Account)
