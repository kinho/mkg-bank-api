import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'

import { UserPayload } from '@modules/auth'
import { requireAuth } from '@modules/auth/auth.middleware'
import {
  CreateTransactionArgs,
  ListTransactionsArgs,
  Transaction,
  TransactionConnection,
  createTransaction,
  listTransactions,
} from '@modules/transaction'

@Resolver(() => Transaction)
export class TransactionResolver {
  @UseMiddleware(requireAuth)
  @Query(() => TransactionConnection)
  async listTransactions(
    @Args(() => ListTransactionsArgs) args: ListTransactionsArgs,
  ): Promise<TransactionConnection> {
    return listTransactions(args)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => Transaction)
  async createTransaction(
    @Ctx('user') user: UserPayload,
    @Arg('input', () => CreateTransactionArgs) args: CreateTransactionArgs,
  ): Promise<Transaction | null> {
    return createTransaction(args, user)
  }
}
