import type { Express } from 'express';
import expressSession from 'express-session';
import type {
  HydratedDocument,
  PassportLocalModel,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  PassportLocalSchema,
} from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';

type UserDocType = {
  password: string;
  username: string;
};

const UserSchema: PassportLocalSchema = new Schema<
  HydratedDocument<UserDocType>
>({
  password: String,
  username: String,
});

UserSchema.plugin(passportLocalMongoose);
export const UserModel: PassportLocalModel<HydratedDocument<UserDocType>> =
  mongoose.model('userInfo', UserSchema, 'userInfo');

passport.use(UserModel.createStrategy());

// TODO #25: Remove `any` cast. These methods have the wrong type.
passport.serializeUser(UserModel.serializeUser() as any);
passport.deserializeUser(UserModel.deserializeUser() as any);

export function initUserModels(app: Express): void {
  const sessionConfig = expressSession({
    // forces the session to be saved back to the session store
    resave: false,
    // forces a session that is “uninitialized” to be saved to the store
    saveUninitialized: false,
    secret: 'secret',
  });
  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
}
