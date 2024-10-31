import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'
import { User, UserRoleEnum } from './'

@ArgsType()
export class ListUsersArgs {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum

  @Field(() => ID, { nullable: true })
  company_id?: ObjectId

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => Number, { nullable: true })
  offset?: number
}

@ObjectType()
export class ListUsersResponse {
  @Field(() => Number)
  count!: number

  @Field(() => [User])
  data!: User[]
}

@InputType()
export class CreateUserArgs implements Pick<User, 'name' | 'email' | 'password' | 'role'> {
  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string

  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum
}

@InputType()
export class UpdateUserArgs {
  @Field(() => ID)
  _id!: ObjectId

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String, { nullable: true })
  password?: string | null

  @Field(() => ID, { nullable: true })
  company?: ObjectId | null

  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum
}
