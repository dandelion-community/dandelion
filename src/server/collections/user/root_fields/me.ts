import { UserGraphQLType } from 'src/server/collections/user/UserGraphQLTypes';

function meResolver(
  _: unknown,
  _args: Record<string, never>,
  req: Express.Request,
): Express.User | undefined {
  const user = req.user;
  if (user == null) {
    return undefined;
  }
  return user;
}

const me = {
  resolve: meResolver,
  type: UserGraphQLType,
};

export default me;
