import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import { initUserModels } from '../authentication/user_model';
import { initGraphQL } from '../graphql/schema';
import { initMongoClient } from '../mongo/client';

const rootDirectory = path.normalize(path.join(__dirname, '../..'));

const app = express();

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

export default app;
