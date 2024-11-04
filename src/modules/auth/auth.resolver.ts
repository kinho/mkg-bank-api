import { Arg, Mutation, Resolver } from 'type-graphql'

import { LoginArgs, LoginResponse, login } from '@modules/auth'

@Resolver()
export class AuthResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg('input', () => LoginArgs) args: LoginArgs,
  ): Promise<LoginResponse> {
    return login(args)
  }
}
