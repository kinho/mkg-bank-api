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

import { UserPayload } from '@modules/auth'
import { requireAuth } from '@modules/auth/auth.middleware'
import { Company, getCompany } from '@modules/company'
import {
  CreateUserArgs,
  ListUsersArgs,
  ListUsersResponse,
  UpdateUserArgs,
  User,
  createUser,
  getUser,
  listUsers,
  updateUser,
} from '@modules/user'

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => Company)
  async company(@Root() user: User): Promise<Company | null> {
    if (!user.company) return null
    return getCompany(user.company.toString())
  }

  @UseMiddleware(requireAuth)
  @Query(() => User)
  async getUser(@Arg('id', () => String) id: string): Promise<User | null> {
    return getUser(id)
  }

  @UseMiddleware(requireAuth)
  @Query(() => ListUsersResponse)
  async listUsers(
    @Args(() => ListUsersArgs) args: ListUsersArgs,
  ): Promise<ListUsersResponse> {
    return listUsers(args)
  }

  @Mutation(() => User)
  async createUser(
    @Arg('input', () => CreateUserArgs) args: CreateUserArgs,
  ): Promise<User | null> {
    return createUser(args)
  }

  @UseMiddleware(requireAuth)
  @Mutation(() => User)
  async updateUser(
    @Ctx('user') user: UserPayload,
    @Arg('input', () => UpdateUserArgs) args: UpdateUserArgs,
  ): Promise<User | null> {
    return updateUser(args, user)
  }
}
