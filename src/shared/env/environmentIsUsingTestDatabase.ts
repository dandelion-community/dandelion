import env from 'src/shared/env/env';

export default function environmentIsUsingTestDatabase(): boolean {
  return env.MONGODB_DB_NAME === 'AidApp-Test';
}
