import logServerError from '../error/logServerError';

export default function setTimeoutSafe(
  loggingTag: string,
  ...[callback, ...args]: Parameters<typeof setTimeout>
): ReturnType<typeof setTimeout> {
  const s = setTimeout; // bypass @chloe-47/eslint-plugin-no-set-timeout
  return s(() => {
    try {
      callback();
    } catch (e) {
      logServerError(loggingTag, e);
    }
  }, ...args);
}
