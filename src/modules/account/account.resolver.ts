import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'

import {
  Account,
  AccountConnection,
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
} from '@modules/account'
import { UserPayload } from '@modules/auth'
import { requireAuth } from '@modules/auth/auth.middleware'
import { ListCompaniesArgs } from '@modules/company'
import { calculateBalance } from '@modules/transaction'

@Resolver(() => Account)
export class AccountResolver {
  @FieldResolver(() => Number, { nullable: true })
  async amount(@Root() account: Account): Promise<number> {
    return calculateBalance(account._id)
  }

  @UseMiddleware(requireAuth)
  @Query(() => Account)
  async getAccount(
    @Ctx('user') user: UserPayload,
    @Arg('number', () => String) number: string,
  ): Promise<Account | null> {
    return getAccount(number, user)
  }

  @UseMiddleware(requireAuth)
  @Query(() => AccountConnection)
  async listAccounts(
    @Ctx('user') user: UserPayload,
    @Args(() => ListCompaniesArgs) args: ListCompaniesArgs,
  ): Promise<AccountConnection> {
    return listAccounts(args, user)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Account)
  async createAccount(@Ctx('user') user: UserPayload): Promise<Account | null> {
    return createAccount(user)
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
