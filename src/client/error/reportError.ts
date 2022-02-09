import Bugsnag from '@bugsnag/js';
import getTypedError from 'src/client/error/getTypedError';

export default function reportError(e: unknown): void {
  const error = getTypedError(e);
  console.error(error);
  Bugsnag.notify(error);
}
