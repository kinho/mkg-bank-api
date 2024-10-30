import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'
import { prop, getModelForClass } from '@typegoose/typegoose'
import { UserRoleEnum } from './user.enum'

@ObjectType()
export class User {
  @Field(() => ID)
  readonly _id!: ObjectId

  @Field(() => String)
  @prop({ type: String, required: true })
  public name!: string

  @Field(() => String)
  @prop({ type: String, required: true, unique: true })
  public email!: string

  @Field(() => String)
  @prop({ type: String, required: true })
  public password!: string

  @Field(() => UserRoleEnum, { nullable: true })
  @prop({ type: String, enum: UserRoleEnum, required: true, default: UserRoleEnum.DEFAULT })
  public role?: UserRoleEnum

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, required: true, default: Date.now })
  public createdAt!: Date
}

export const UserModel = getModelForClass(User)
