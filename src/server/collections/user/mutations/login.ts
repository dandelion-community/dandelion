import passport from 'passport';
import analytics from 'src/server/analytics';
import type { CurrentUserPayload } from 'src/server/collections/user/UserGraphQLTypes';
import { CurrentUserGraphQLType } from 'src/server/collections/user/UserGraphQLTypes';
import getErrorMessage from 'src/shared/utils/error/getErrorMessage';

async function loginResolver(
  _: unknown,
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.username = username.toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.password = password;
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user, info) => {
      const error =
        err instanceof Error ? err : info instanceof Error ? info : null;
      if (error != null) {
        reportLoginFailed(getErrorMessage(error));
        return reject(error);
      }

      if (!user) {
        reportLoginFailed('user is undefined');
        return resolve({ user: undefined });
      }

      req.logIn(user, function (err) {
        if (err) {
          reportLoginFailed(getErrorMessage(err));
          return reject(err);
        }

        analytics.track({
          event: 'Logged In',
          user,
        });
        return resolve({
          user,
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })(req, (req as any).response, (req as any).next);
  });

  function reportLoginFailed(message: string): void {
    analytics.track({
      event: 'login failed',
      properties: {
        email: username,
        message,
      },
      user: null,
    });
  }
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
