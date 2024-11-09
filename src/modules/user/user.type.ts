import {
  IsEmail,
  IsMongoId,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Connection } from 'graphql-relay'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { ConnectionArguments, PageInfo } from '@modules/relay'
import { User, UserRoleEnum } from '@modules/user'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  STRING_MAX_LENGTH,
  STRING_MIN_LENGTH,
} from '@modules/utils/validation.default'

@InputType()
export class CreateUserArgs
  implements Pick<User, 'name' | 'email' | 'password' | 'role'>
{
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String)
  name!: string

  @IsEmail()
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String)
  email!: string

  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  @Field(() => String)
  password!: string

  @IsOptional()
  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum
}

@InputType()
export class UpdateUserArgs {
  @IsMongoId()
  @Field(() => ID)
  _id!: ObjectId

  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  name?: string | null

  @IsEmail()
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  email?: string | null

  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  password?: string | null

  @IsMongoId()
  @Field(() => ID, { nullable: true })
  company?: ObjectId | null

  @IsOptional()
  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum
}

@ArgsType()
export class ListUsersArgs extends ConnectionArguments {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  name?: string

  @IsEmail()
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  email?: string

  @IsOptional()
  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum

  @IsMongoId()
  @Field(() => ID, { nullable: true })
  company_id?: ObjectId
}

@ObjectType()
export class UserEdge {
  @Field(() => User)
  node!: User

  @Field(() => String)
  cursor!: string
}

@ObjectType()
export class UserConnection implements Connection<User> {
  @Field(() => [UserEdge])
  edges!: UserEdge[]

  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => Number)
  totalCount!: number
}
