import getTypedError from 'src/shared/utils/error/getTypedError';

export default function logServerError(
  loggingTag: string,
  error_: unknown,
): void {
  const error = getTypedError(error_);
  console.error(`Error [${loggingTag}]`, error);
}
