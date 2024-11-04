import {
  IsEmail,
  IsMongoId,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { User, UserRoleEnum } from '@modules/user'
import { getEnumInfo } from '@modules/utils/enum.tools'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  STRING_MAX_LENGTH,
  STRING_MIN_LENGTH,
} from '@modules/utils/validation.default'

@ArgsType()
export class ListUsersArgs {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  name?: string

  @IsEmail()
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  email?: string

  // @IsEnum(UserRoleEnum)
  @IsOptional()
  @Field(() => UserRoleEnum, {
    nullable: true,
    description: getEnumInfo(UserRoleEnum),
  })
  role?: UserRoleEnum

  @IsMongoId()
  @Field(() => ID, { nullable: true })
  company_id?: ObjectId

  @Min(1)
  @Max(50)
  @Field(() => Number, { nullable: true })
  limit?: number

  @Min(0)
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

  // @IsEnum(UserRoleEnum)
  @IsOptional()
  @Field(() => UserRoleEnum, {
    nullable: true,
    description: getEnumInfo(UserRoleEnum),
  })
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

  // @IsEnum(UserRoleEnum)
  @IsOptional()
  @Field(() => UserRoleEnum, {
    nullable: true,
    description: getEnumInfo(UserRoleEnum),
  })
  role?: UserRoleEnum
}
