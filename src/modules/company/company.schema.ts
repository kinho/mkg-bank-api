import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Company {
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
