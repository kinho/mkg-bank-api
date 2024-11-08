import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'

import { requireAuth } from '@modules/auth/auth.middleware'
import {
  Company,
  CompanyConnection,
  CreateCompanyArgs,
  ListCompaniesArgs,
  UpdateCompanyArgs,
  createCompany,
  deleteCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from '@modules/company'

@Resolver(() => Company)
export class CompanyResolver {
  @UseMiddleware(requireAuth)
  @Query(() => Company)
  async getCompany(
    @Arg('id', () => String) id: string,
  ): Promise<Company | null> {
    return getCompany(id)
  }

  @UseMiddleware(requireAuth)
  @Query(() => CompanyConnection)
  async listCompanies(
    @Args(() => ListCompaniesArgs) args: ListCompaniesArgs,
  ): Promise<CompanyConnection> {
    return listCompanies(args)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Company)
  async createCompany(
    @Arg('input', () => CreateCompanyArgs) args: CreateCompanyArgs,
  ): Promise<Company | null> {
    return createCompany(args)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Company)
  async updateCompany(
    @Arg('input', () => UpdateCompanyArgs) args: UpdateCompanyArgs,
  ): Promise<Company | null> {
    return updateCompany(args)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Company)
  async deleteCompany(
    @Arg('id', () => String) id: string,
  ): Promise<Company | null> {
    return deleteCompany(id)
  }
}
