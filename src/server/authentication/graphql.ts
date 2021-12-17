import passport from 'passport';
import analytics from '../analytics';
import { UserModel } from '../authentication/user_model';

export type User = {
  username: string;
};

export const USER_GQL = `
  type User {
    username: String
  }
`;

export type CurrentUserPayload = {
  user: User | undefined;
};

export const CURRENT_USER_PAYLOAD_GQL = `
  type CurrentUserPayload {
    user: User
  }
`;

export function me(
  _args: Record<string, never>,
  req: Express.Request,
): User | undefined {
  const user = req.user;
  if (user == null) {
    return undefined;
  }
  return {
    // dunno how to tell Express that we have a username field here
    username: (user as any).username,
  };
}

export async function login(
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  // Passport expects these to be in the request body, not in
  // the GraphQL argument payload.
  (req as any).body.username = username;
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
        resolve({ user: { username: user.username } });
      });
      // Todo, fix any casts
    })(req, (req as any).response, (req as any).next);
  });
}

export async function register(
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  // Passport expects these to be in the request body, not in
  // the GraphQL argument payload.
  (req as any).body.username = username;
  (req as any).body.password = password;
  return new Promise((resolve, reject) => {
    passport.authenticate('local', async (err, user, _info) => {
      if (err) {
        return reject(err);
      }

      if (user) {
        throw new Error('User already exists');
      }
      // Todo, fix any casts
      const newUser = await UserModel.register({ username } as any, password);
      analytics.identify({ traits: { username }, userId: newUser.id });
      analytics.track({ event: 'Create Account', userId: newUser.id });
      console.log('Tracking!');
      req.logIn(newUser, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve({ user: { username: newUser.username } });
      });
      // Todo, fix any casts
    })(req, (req as any).response, (req as any).next);
  });
}

export function logout(
  _args: Record<string, never>,
  req: Express.Request,
): CurrentUserPayload {
  req.logout();
  return { user: undefined };
}
