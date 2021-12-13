import dotenv from 'dotenv';

dotenv.config();

const PASSWORD = process.env.MONGODB_USER_0_PASSWORD;
const CLUSTER = 'aid-app-cluster-0';
const DEFAULT_DB_NAME = 'AidApp';
const DB_USER_NAME = 'aid-app-user-0';

export const MONGO_DB_URI =
  'mongodb+srv://' +
  DB_USER_NAME +
  ':' +
  PASSWORD +
  '@' +
  CLUSTER +
  '.iquft.mongodb.net/' +
  DEFAULT_DB_NAME +
  '?retryWrites=true&w=majority';
