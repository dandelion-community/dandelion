import MongoStore from 'connect-mongo';
import type { Express } from 'express';
import expressSession from 'express-session';
import type { ObjectId } from 'mongodb';
import type {
  HydratedDocument,
  PassportLocalModel,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  PassportLocalSchema,
} from 'mongoose';
import mongoose, { Document, Schema } from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { AidRequestReference } from 'src/server/collections/aid_request/AidRequestModelTypes';
import type { UserDocType } from 'src/server/collections/user/UserModelTypes';
import { MONGO_DB_URI } from 'src/server/mongo/client';
import getEnvironmentVariableAndThrowIfNotFound from 'src/shared/env/getEnvironmentVariableAndThrowIfNotFound';

export type UserType = Document<string, unknown, UserDocType> &
  UserDocType & { _id: ObjectId };

// Idk what's wrong here
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const UserSchema: PassportLocalSchema = new Schema<UserDocType>({
  aidRequestsIAmWorkingOn: [AidRequestReference],
  crews: [String],
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

const SESSION_SECRET =
  getEnvironmentVariableAndThrowIfNotFound('SESSION_SECRET');

export function initUserModels(app: Express): void {
  const store = MongoStore.create({
    mongoUrl: MONGO_DB_URI,
    ttl: 1000 * 365 * 24 * 60 * 60,
  });
  const sessionConfig = expressSession({
    cookie: {
      maxAge: 1000 * 3600 * 24 * 365 * 1000,
    },

    // forces the session to be saved back to the session store
    resave: false,
    // forces a session that is ???uninitialized??? to be saved to the store
    saveUninitialized: false,
    secret: SESSION_SECRET as string,
    store,
  });
  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
}
