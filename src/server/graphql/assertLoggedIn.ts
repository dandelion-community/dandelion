import type { GraphQLResolveInfo } from 'graphql';
import type { ResolverMiddleware } from 'graphql-compose';

export default function assertLoggedIn(
  req: Express.Request,
  what: string,
): Express.User {
  const { user } = req;
  if (user == null) {
    throw new Error('You must be logged in for action ' + what);
  }
  return user;
}

export function createAssertLoggedInMiddleware<TSource, TArgs, TOut>(
  what: string,
): ResolverMiddleware<TSource, Express.Request, TArgs> {
  function assertLoggedInMiddleware(
    resolve: (
      source: TSource,
      args: TArgs,
      req: Express.Request,
      info: GraphQLResolveInfo,
    ) => TOut,
    source: TSource,
    args: TArgs,
    req: Express.Request,
    info: GraphQLResolveInfo,
  ): TOut {
    assertLoggedIn(req, what);
    return resolve(source, args, req, info);
  }
  return assertLoggedInMiddleware;
}
