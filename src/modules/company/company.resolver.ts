import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql'

import {
  Company,
  CreateCompanyArgs,
  ListCompaniesArgs,
  ListCompaniesResponse,
  UpdateCompanyArgs,
  createCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from '@modules/company'

@Resolver(() => Company)
export class CompanyResolver {
  @Query(() => Company)
  async getCompany(
    @Arg('id', () => String) id: string,
  ): Promise<Company | null> {
    return getCompany(id)
  }

  @Query(() => ListCompaniesResponse)
  async listCompanies(
    @Args(() => ListCompaniesArgs) args: ListCompaniesArgs,
  ): Promise<ListCompaniesResponse> {
    return listCompanies(args)
  }

  @Mutation(() => Company)
  async createCompany(
    @Arg('input', () => CreateCompanyArgs) args: CreateCompanyArgs,
  ): Promise<Company | null> {
    return createCompany(args)
  }

  @Mutation(() => Company)
  async updateCompany(
    @Arg('input', () => UpdateCompanyArgs) args: UpdateCompanyArgs,
  ): Promise<Company | null> {
    return updateCompany(args)
  }
}
