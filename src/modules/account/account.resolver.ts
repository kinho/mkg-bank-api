import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'

import {
  Account,
  ListAccountsArgs,
  ListAccountsResponse,
  UpdateAccountArgs,
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  updateAccount,
} from '@modules/account'
import { UserPayload } from '@modules/auth'
import { requireAuth } from '@modules/auth/auth.middleware'

@Resolver(() => Account)
export class AccountResolver {
  @UseMiddleware(requireAuth)
  @Query(() => Account)
  async getAccount(
    @Ctx('user') user: UserPayload,
    @Arg('number', () => String) number: string,
  ): Promise<Account | null> {
    return getAccount(number, user)
  }

  @UseMiddleware(requireAuth)
  @Query(() => ListAccountsResponse)
  async listAccounts(
    @Ctx('user') user: UserPayload,
    @Args(() => ListAccountsArgs) args: ListAccountsArgs,
  ): Promise<ListAccountsResponse> {
    return listAccounts(args, user)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Account)
  async createAccount(@Ctx('user') user: UserPayload): Promise<Account | null> {
    return createAccount(user)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Account)
  async updateAccount(
    @Ctx('user') user: UserPayload,
    @Arg('input', () => UpdateAccountArgs) args: UpdateAccountArgs,
  ): Promise<Account | null> {
    return updateAccount(args, user)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Account)
  async deleteAccount(
    @Ctx('user') user: UserPayload,
    @Arg('id', () => String) id: string,
  ): Promise<Account | null> {
    return deleteAccount(id, user)
  }
}