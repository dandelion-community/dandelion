import mongoose from 'mongoose';
import passport from 'passport';
import analytics from '../../../analytics';
import type { CurrentUserPayload } from '../UserGraphQLTypes';
import { CurrentUserGraphQLType } from '../UserGraphQLTypes';
import { UserModel } from '../UserModel';

async function registerResolver(
  _: unknown,
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  const allowlistEntry = await mongoose.connection.db
    .collection('email-allowlist')
    .findOne({ email: username });
  if (allowlistEntry == null) {
    throw new Error(
      "To protect the privacy of our users' data, you cannot create an account without first being added to the list of allowed users. Please email lowell.organizing@gmail.com if you'd like to be added!",
    );
  }

  // Passport expects these to be in the request body, not in
  // the GraphQL argument payload.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.username = username;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.password = password;
  return new Promise((resolve, reject) => {
    passport.authenticate('local', async (err, user, _info) => {
      if (err) {
        return reject(err);
      }

      if (user) {
        throw new Error('User already exists');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newUser = await UserModel.register({ username } as any, password);
      analytics.identify({ traits: { username }, userId: newUser.id });
      analytics.track({ event: 'Create Account', userId: newUser.id });
      req.logIn(newUser, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve({
          user,
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })(req, (req as any).response, (req as any).next);
  });
}

const register = {
  args: {
    password: 'String!',
    username: 'String!',
  },
  resolve: registerResolver,
  type: CurrentUserGraphQLType,
};

export default register;
