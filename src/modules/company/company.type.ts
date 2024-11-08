import { IsMongoId, MaxLength, MinLength } from 'class-validator'
import { Connection } from 'graphql-relay'
import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { Company } from '@modules/company'
import { ConnectionArguments, PageInfo } from '@modules/relay'
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
export class ListCompaniesArgs extends ConnectionArguments {
  @MinLength(STRING_MIN_LENGTH)
  @MaxLength(STRING_MAX_LENGTH)
  @Field(() => String, { nullable: true })
  name?: string
}

@ObjectType()
export class CompanyEdge {
  @Field(() => Company)
  node!: Company

  @Field(() => String)
  cursor!: string
}

@ObjectType()
export class CompanyConnection implements Connection<Company> {
  @Field(() => [CompanyEdge])
  edges!: CompanyEdge[]

  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => Number)
  totalCount!: number
}
