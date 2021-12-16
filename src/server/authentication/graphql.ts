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
  console.log('Loaded myself: ' + JSON.stringify(user));
  if (user == null) {
    return undefined;
  }
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
        console.log('case 1');
        return reject(err);
      }

      if (!user) {
        console.log('No user found (case 2)');
        resolve({ user: undefined });
      }

      req.logIn(user, function (err) {
        console.log('case 3');
        if (err) {
          console.log('case 4');
          reject(err);
        }
        console.log('case 5');
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
    passport.authenticate('local', async (err, user, _info) => {
      console.log('case 6');
      if (err) {
        console.log('case 7');
        return reject(err);
      }

      console.log('case 8');
      if (user) {
        console.log('case 9');
        throw new Error('User already exists');
      }
      console.log('case 10');
      const newUser = await UserModel.register({ username } as any, password);
      console.log('case 11', newUser);
      req.logIn(newUser, function (err) {
        console.log('case 12');
        if (err) {
          console.log('case 13');
          return reject(err);
          console.log('case 14');
        }
        console.log('case 15');
        return resolve({ user: { username: newUser.username } });
        console.log('case 16');
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
