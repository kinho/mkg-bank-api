import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ID, ObjectType } from 'type-graphql'

import { Company } from '@modules/company'
import { UserRoleEnum } from '@modules/user'

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
  @prop({
    type: String,
    enum: UserRoleEnum,
    required: true,
    default: UserRoleEnum.DEFAULT,
  })
  public role?: UserRoleEnum

  @Field(() => Company, { nullable: true })
  @prop({ ref: () => Company })
  public company?: Ref<Company>

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, required: true, default: Date.now })
  public createdAt!: Date
}

export const UserModel = getModelForClass(User)

export type PartialUser = Omit<User, '_id' | 'createdAt' | 'company'> & {
  _id?: string
  createdAt?: Date
  company?: string
}
