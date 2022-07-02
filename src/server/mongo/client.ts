import mongoose from 'mongoose';
import env from 'src/shared/env/env';

const PASSWORD = env.MONGODB_USER_0_PASSWORD;
const CLUSTER = 'aid-app-cluster-0';
const DEFAULT_DB_NAME = env.MONGODB_DB_NAME;
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

export function initMongoClient(): void {
  mongoose.connect(MONGO_DB_URI);
}
