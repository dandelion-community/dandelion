import bodyParser from 'body-parser';
import connectEnsureLogin from 'connect-ensure-login';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressSession from 'express-session';
import mongoose, { Schema } from 'mongoose';
import logger from 'morgan';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import path from 'path';
import { MONGO_DB_URI } from '../mongo/client';

const rootDirectory = path.normalize(path.join(__dirname, '../..'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const expressSessionInstance = expressSession({
  // forces the session to be saved back to the session store
  resave: false,
  // forces a session that is “uninitialized” to be saved to the store
  saveUninitialized: false,
  secret: 'secret',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSessionInstance);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

type UserDocType = {
  password: string;
  username: string;
};

const UserDetail = new Schema<UserDocType>({
  password: String,
  username: String,
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

// TODO #25: Remove any cast. These methods aren't recongized.
passport.use((UserDetails as any).createStrategy());

passport.serializeUser((UserDetails as any).serializeUser());
passport.deserializeUser((UserDetails as any).deserializeUser());

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login?info=' + info);
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/private');
    });
  })(req, res, next);
});

app.get('/login', (req, res) => {
  res.sendFile('html/login.html', { root: rootDirectory });
});

app.use(express.static(path.join(rootDirectory, 'css')));

app.get('/home', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.sendFile('html/index.html', { root: rootDirectory }),
);

app.get('/private', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.sendFile('html/private.html', { root: rootDirectory }),
);

app.get('/user', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.send({ user: req.user }),
);

app.use(express.static(path.join(rootDirectory, 'web-build')));

export default app;
