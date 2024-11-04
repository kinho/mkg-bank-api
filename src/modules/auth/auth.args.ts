import { Field, InputType, ObjectType } from 'type-graphql'

import { User } from '@modules/user'

@InputType()
export class LoginArgs {
  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => String, { nullable: true })
  token?: string
}
