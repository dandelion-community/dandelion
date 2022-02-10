import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export default function getPasswordResetToken(username: string): string {
  return hash({ today: new Date().getUTCDate(), username });
}

function hash(value: unknown): string {
  const hash = crypto.createHmac(
    'sha512',
    process.env.SESSION_SECRET as string,
  );
  hash.update(JSON.stringify(value));
  return hash.digest('hex');
}
