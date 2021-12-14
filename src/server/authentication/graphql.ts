import passport from 'passport';
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
  console.log('user is null or undefined');
  console.log(JSON.stringify(user));
  if (user == null) {
    return undefined;
  }
  console.log('user');
  console.log(user);
  return {
    username: (user as any).username,
  };
}

export async function login(
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  (req as any).body.username = username;
  (req as any).body.password = password;
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user, _info) => {
      if (err) {
        reject(err);
      }

      if (!user) {
        console.log('No user found');
        resolve({ user: undefined });
      }

      req.logIn(user, function (err) {
        if (err) {
          reject(err);
        }

        resolve({ user: { username: user.username } });
      });
    })(req, (req as any).response, (req as any).next);
  });
}

export async function register(
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
  (req as any).body.username = username;
  (req as any).body.password = password;
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user, _info) => {
      if (err) {
        reject(err);
      }

      if (user) {
        throw new Error('User already exists');
      }

      UserModel.register({ username } as any, password).then((newUser) => {
        req.logIn(newUser, function (err) {
          if (err) {
            reject(err);
          }
          resolve({ user: { username: newUser.username } });
        });
      });
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
