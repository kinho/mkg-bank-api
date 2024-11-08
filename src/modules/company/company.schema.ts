import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'

import { Node } from '../relay/relay.type'

@ObjectType({ implements: Node })
export class Company implements Node {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field(() => String)
  @prop({ type: String, required: true })
  public name!: string

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, required: true, default: Date.now })
  public createdAt!: Date
}

export const CompanyModel = getModelForClass(Company)
