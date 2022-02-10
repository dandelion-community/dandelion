import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import proxy from 'express-http-proxy';
import logger from 'morgan';
import path from 'path';
import { initUserModels } from 'src/server/collections/user/UserModel';
import { initGraphQL } from 'src/server/graphql/GraphQLSchema';
import { initMongoClient } from 'src/server/mongo/client';

dotenv.config();

const rootDirectory = path.normalize(path.join(__dirname, '../../..'));

const app = express();
app.set('views', path.normalize(path.join(rootDirectory, 'src/server/views')));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initMongoClient();
initUserModels(app);
initGraphQL(app);

app.use(express.static(path.join(rootDirectory, 'assets')));

if (process.env.HOT_RELOAD === 'True') {
  app.use(proxy('localhost:19006'));
} else {
  app.use(express.static(path.join(rootDirectory, 'web-build')));
  app.get('/*', (req, res) =>
    res.sendFile('web-build/index.html', { root: rootDirectory }),
  );
}

export default app;
