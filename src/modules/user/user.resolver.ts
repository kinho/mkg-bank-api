import { Query, Resolver, Mutation, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { CreateUserArgs, User, ListUsersArgs, ListUsersResponse, UpdateUserArgs } from './'
import { createUser, getUser, listUsers, updateUser } from './user.service'
import { Company, getCompany } from '../company'

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => Company)
  async company(@Root() user: User): Promise<Company | null> {
    if (!user.company) return null
    return getCompany(user.company.toString())
  }

  @Query(() => User)
  async getUser(@Arg('id', () => String) id: string): Promise<User | null> {
      return getUser(id)
  }

  @Query(() => ListUsersResponse)
  async listUsers(@Args(() => ListUsersArgs) args: ListUsersArgs): Promise<ListUsersResponse> {
    return listUsers(args)
  }

  @Mutation(() => User)
  async createUser(@Arg('input', () => CreateUserArgs) args: CreateUserArgs): Promise<User | null> {
    return createUser(args)
  }

  @Mutation(() => User)
  async updateUser(@Arg('input', () => UpdateUserArgs) args: UpdateUserArgs): Promise<User | null> {
    return updateUser(args)
  }
}
