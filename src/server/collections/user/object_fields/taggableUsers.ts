import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { UserGraphQLType } from 'src/server/collections/user/UserGraphQLTypes';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

UserGraphQLType;

const taggableUsers: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Express.User,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: userID }: Express.User,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<Express.User>> => {
    const viewer = assertLoggedIn(req, 'taggableUsers');
    const user = await UserModel.findById(userID);
    if (user == null) {
      return [];
    }
    if (!viewer._id.equals(user._id)) {
      throw new Error("You cannot load another user's taggable users");
    }
    const usersPerCrew = await Promise.all(
      user.crews.map(async (crew: string): Promise<Array<Express.User>> => {
        return await UserModel.find({ crews: crew });
      }),
    );
    const users = usersPerCrew.reduce(
      (agg: Array<Express.User>, list: Array<Express.User>) => {
        list.forEach((user: Express.User): void => {
          if (
            agg.every(
              (other: Express.User): boolean => !user._id.equals(other._id),
            )
          ) {
            agg.push(user);
          }
        });
        return agg;
      },
      [],
    );
    return users;
  },
  type: '[User!]!',
};

export default taggableUsers;
