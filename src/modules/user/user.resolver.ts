import { Query, Resolver, Mutation, Arg, Args } from 'type-graphql'
import { createUser, getUser, getUsers } from './user.service'
import { CreateUserArgs, User, GetUsersArgs, GetUsersResponse } from "./"

@Resolver(() => User)
export class UserResolver {
  @Query(() => GetUsersResponse)
  async getUsers(@Args(() => GetUsersArgs) args: GetUsersArgs): Promise<GetUsersResponse> {
    return getUsers(args)
  }

  @Query(() => User)
  async getUser(@Arg('id', () => String) id: string): Promise<User | null> {
      return getUser(id)
  }

  @Mutation(() => User)
  async createUser(@Arg('input', () => CreateUserArgs) args: CreateUserArgs): Promise<User | null> {
    return createUser(args)
  }
}
