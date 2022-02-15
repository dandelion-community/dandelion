import getTypedError from 'src/shared/utils/error/getTypedError';

export default function getErrorMessage(e: unknown): string {
  return getTypedError(e).message;
}
