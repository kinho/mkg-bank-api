import { IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { Company } from '@modules/company'
import {
  STRING_MAX_LENGTH,
  STRING_MIN_LENGTH,
} from '@modules/utils/validation.default'

@InputType()
export class CreateCompanyArgs implements Pick<Company, 'name'> {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String)
  name!: string
}

@InputType()
export class UpdateCompanyArgs {
  @IsMongoId()
  @Field(() => ID)
  _id!: ObjectId

  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  name?: string | null
}

@ArgsType()
export class ListCompaniesArgs {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  name?: string

  @Min(1)
  @Max(50)
  @Field(() => Number, { nullable: true, defaultValue: 10 })
  limit?: number = 10

  @Min(0)
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  offset?: number = 0
}

@ObjectType()
export class ListCompaniesResponse {
  @Field(() => Number)
  count!: number

  @Field(() => [Company])
  data!: Company[]
}
