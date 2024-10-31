import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql'

import { Company } from './'

@InputType()
export class CreateCompanyArgs implements Pick<Company, 'name'> {
  @Field(() => String)
  name!: string
}

@InputType()
export class UpdateCompanyArgs {
  @Field(() => ID)
  _id!: ObjectId

  @Field(() => String, { nullable: true })
  name?: string | null
}

@ArgsType()
export class ListCompaniesArgs {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => Number, { nullable: true })
  offset?: number
}

@ObjectType()
export class ListCompaniesResponse {
  @Field(() => Number)
  count!: number

  @Field(() => [Company])
  data!: Company[]
}
