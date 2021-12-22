import { schemaComposer } from 'graphql-compose';
import passport from 'passport';
import analytics from '../analytics';
import { UserModel } from './user_model';

declare global {
  namespace Express {
    interface User {
      username: string;
    }
  }
}

const UserTC = schemaComposer.createObjectTC({
  fields: {
    username: 'String',
  },
  name: 'User',
});

const CurrentUserTC = schemaComposer.createObjectTC({
  fields: {
    user: 'User',
  },
  name: 'CurrentUser',
});

interface UserDocument {
  username: string;
}

type CurrentUserPayload = {
  user: UserDocument | undefined;
};

function meResolver(
  _: unknown,
  _args: Record<string, never>,
  req: Express.Request,
): UserDocument | undefined {
  const user = req.user;
  if (user == null) {
    return undefined;
  }
  return {
    username: user.username,
  };
}

const me = {
  resolve: meResolver,
  type: UserTC,
};

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
        resolve({ user: { username: user.username } });
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
  type: CurrentUserTC,
};

async function registerResolver(
  _: unknown,
  { username, password }: { username: string; password: string },
  req: Express.Request,
): Promise<CurrentUserPayload> {
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
        return resolve({ user: { username: newUser.username } });
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
  type: CurrentUserTC,
};

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
  type: CurrentUserTC,
};

const User = {
  MutationFields: {
    login,
    logout,
    register,
  },
  QueryFields: {
    me,
  },
};

export default User;
