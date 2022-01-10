import dotenv from 'dotenv';
import type { Express } from 'express';
import expressSession from 'express-session';
import type {
  HydratedDocument,
  PassportLocalModel,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  PassportLocalSchema
} from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { AidRequestReference } from '../aid_request/AidRequestModelTypes';
import type { UserDocType } from './UserModelTypes';

dotenv.config();

const UserSchema: PassportLocalSchema = new Schema<UserDocType>({
  aidRequestsIAmWorkingOn: [AidRequestReference],
  displayName: String,
  password: String,
  username: String,
});

UserSchema.plugin(passportLocalMongoose);
export const UserModel: PassportLocalModel<HydratedDocument<UserDocType>> =
  mongoose.model('userInfo', UserSchema, 'userInfo');

passport.use(UserModel.createStrategy());

// TODO #25: Remove `any` cast. These methods have the wrong type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser(UserModel.serializeUser() as any);
passport.deserializeUser(UserModel.deserializeUser());

const SESSION_SECRET = process.env.SESSION_SECRET;
if (SESSION_SECRET == null) {
  throw new Error(
    'The SESSION_SECRET environment variable must be set to support authentication',
  );
}

export function initUserModels(app: Express): void {
  const sessionConfig = expressSession({
    cookie: {
      maxAge: 1000 * 3600 * 24 * 365 * 1000,
    },

    // forces the session to be saved back to the session store
    resave: false,
    // forces a session that is “uninitialized” to be saved to the store
    saveUninitialized: false,
    secret: SESSION_SECRET as string,
  });
  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
}
