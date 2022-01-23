import type { GraphQLResolveInfo } from 'graphql';
import type { ResolverMiddleware } from 'graphql-compose';
import type { FilterFindManyAidRequestInput } from 'src/../__generated__/globalTypes';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

export default function createAidRequestPermissionMiddleware<
  TSource,
  TArgs,
  TOut,
>(): ResolverMiddleware<TSource, Express.Request, TArgs> {
  function aidRequestPermissionMiddleware(
    resolve: (
      source: TSource,
      args: TArgs,
      req: Express.Request,
      info: GraphQLResolveInfo,
    ) => TOut,
    source: TSource,
    args_: TArgs,
    req: Express.Request,
    info: GraphQLResolveInfo,
  ): TOut {
    const user = assertLoggedIn(req, 'aidRequestPermissionMiddleware');
    const args = args_ as unknown as { filter: FilterFindManyAidRequestInput };
    const { crews } = user;
    if (crews == null || crews.length === 0) {
      throw new Error('User not part of any crews');
    }
    const crewFilter =
      crews.length === 1
        ? { crew: crews[0] }
        : { OR: crews.map((crew) => ({ crew })) };

    args.filter = args.filter ? { AND: [args.filter, crewFilter] } : crewFilter;
    return resolve(source, args as unknown as TArgs, req, info);
  }
  return aidRequestPermissionMiddleware;
}
