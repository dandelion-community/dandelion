import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import { initGraphQL } from '../graphql/GraphQLSchema';
import { initUserModels } from '../models/user_model';
import { initMongoClient } from '../mongo/client';

const rootDirectory = path.normalize(path.join(__dirname, '../..'));

const app = express();

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

app.use(express.static(path.join(rootDirectory, 'web-build')));
app.get('/*', (req, res) =>
  res.sendFile('web-build/index.html', { root: rootDirectory }),
);

export default app;
