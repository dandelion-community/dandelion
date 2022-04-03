import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import { UserGraphQLType } from '../UserGraphQLTypes';

async function changeNameResolver(
  _: unknown,
  { displayName }: { displayName: string },
  req: Express.Request,
): Promise<Express.User | null> {
  if (displayName.length === 0) {
    throw new Error('Name cannot be empty');
  }
  const viewer = assertLoggedIn(req, 'changeName');
  const updated = await UserModel.findByIdAndUpdate(
    viewer._id,
    { displayName },
    { updated: true },
  );
  return updated;
}

const changeName = {
  args: {
    displayName: 'String!',
  },
  resolve: changeNameResolver,
  type: UserGraphQLType,
};

export default changeName;
