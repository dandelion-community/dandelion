import dotenv from 'dotenv';

dotenv.config();

export default function getDomain(): string {
  if (process.env.MONGODB_DB_NAME === 'AidApp-Test') {
    return 'http://';
  } else {
    return 'https://';
  }
}
