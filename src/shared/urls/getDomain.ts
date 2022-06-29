import dotenv from 'dotenv';

dotenv.config();

type Options = {
  neverUseLocalhost?: true;
};

export default function getDomain(options?: Options): string {
  if (
    process.env.MONGODB_DB_NAME === 'AidApp-Test' &&
    !options?.neverUseLocalhost
  ) {
    return 'localhost:3333';
  } else {
    return 'dandelion.supplies';
  }
}
