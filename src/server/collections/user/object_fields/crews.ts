import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

const aidRequestsIAmWorkingOn: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Express.User,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: userID }: Express.User,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<string>> => {
    const viewer = assertLoggedIn(req, 'aidRequestsIAmWorkingOn');
    const user = await UserModel.findById(userID);
    if (user == null) {
      return [];
    }
    if (!viewer._id.equals(user._id)) {
      throw new Error("You cannot load another user's crews");
    }
    return user.crews;
  },
  type: '[String!]!',
};

export default aidRequestsIAmWorkingOn;
