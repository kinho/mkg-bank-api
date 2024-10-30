import { ArgsType, Field, InputType, ObjectType } from 'type-graphql'
import { User } from './user.schema'
import { UserRoleEnum } from './user.enum'

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

@ArgsType()
export class GetUsersArgs {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => Number, { nullable: true })
  offset?: number
}

@ObjectType()
export class GetUsersResponse {
  @Field(() => Number)
  count!: number

  @Field(() => [User])
  users!: User[]
}
