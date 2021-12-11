import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

const rootDirectory = path.normalize(path.join(__dirname, '..'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/mongo-dev', (req, res) => {
  res.send('this is where we will show mongo results');
});

app.use(express.static(path.join(rootDirectory, 'web-build')));

export default app;
