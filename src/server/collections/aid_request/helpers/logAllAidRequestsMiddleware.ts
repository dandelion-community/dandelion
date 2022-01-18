import type { GraphQLResolveInfo } from 'graphql';
import type { ResolverMiddleware } from 'graphql-compose';
import analytics from 'src/server/analytics';

export default function logAllAidRequestsMiddleware<
  TSource,
  TArgs,
  TOut,
>(): ResolverMiddleware<TSource, Express.Request, TArgs> {
  function logMiddleware(
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
    const args = args_ as unknown as {
      after: null | string;
      filter: { completed?: boolean; whoIsWorkingOnIt?: Array<string> | null };
    };
    const user = req.user as Express.User;
    analytics.track({
      event: 'Loaded Aid Requests',
      properties: {
        isCompletedFilter: args.filter.completed === true ? 'true' : 'false',
        isFirstPage: args.after == null ? 'true' : 'false',
        isMeFilter: (args.filter.whoIsWorkingOnIt ?? []).includes(
          user._id.toString(),
        )
          ? 'true'
          : 'false',
      },
      user: req.user as Express.User,
    });
    return resolve(source, args_, req, info);
  }
  return logMiddleware;
}
