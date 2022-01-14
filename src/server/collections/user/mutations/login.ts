import passport from 'passport';
import type { CurrentUserPayload } from '../UserGraphQLTypes';
import { CurrentUserGraphQLType } from '../UserGraphQLTypes';

async function loginResolver(
  _: unknown,
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.username = username;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.password = password;
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user, _info) => {
      if (err) {
        return reject(err);
      }

      if (!user) {
        resolve({ user: undefined });
      }

      req.logIn(user, function (err) {
        if (err) {
          reject(err);
        }
        resolve({
          user,
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })(req, (req as any).response, (req as any).next);
  });
}

const login = {
  args: {
    password: 'String!',
    username: 'String!',
  },
  resolve: loginResolver,
  type: CurrentUserGraphQLType,
};

export default login;
