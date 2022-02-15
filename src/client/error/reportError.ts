import Bugsnag from '@bugsnag/expo';
import getTypedError from 'src/shared/utils/error/getTypedError';

export default function reportError(e: unknown): void {
  const error = getTypedError(e);
  console.error(error);
  Bugsnag.notify(error);
}
