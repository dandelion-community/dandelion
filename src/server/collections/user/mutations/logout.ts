import type { CurrentUserPayload } from '../UserGraphQLTypes';
import { CurrentUserGraphQLType } from '../UserGraphQLTypes';

function logoutResolver(
  _: unknown,
  _args: Record<string, never>,
  req: Express.Request,
): CurrentUserPayload {
  req.logout();
  return { user: undefined };
}

const logout = {
  resolve: logoutResolver,
  type: CurrentUserGraphQLType,
};

export default logout;
