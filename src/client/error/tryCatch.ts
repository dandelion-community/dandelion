import getTypedError from 'src/client/error/getTypedError';
import reportError from 'src/client/error/reportError';

type Args<T> =
  | {
      run: () => T;
      valueOnError: T;
    }
  | {
      run: () => T;
      valueOnErrorFn: (error: Error) => T;
    };

export default function tryCatch<T>(args: Args<T>): T {
  try {
    return args.run();
  } catch (e: unknown) {
    const error = getTypedError(e);
    reportError(error);
    if ('valueOnError' in args) {
      return args.valueOnError;
    } else {
      return args.valueOnErrorFn(error);
    }
  }
}

export function tryOrNullOnError<T>(run: () => T): T | null {
  try {
    return run();
  } catch (e: unknown) {
    reportError(e);
    return null;
  }
}

export async function tryOrYieldNullOnError<T>(
  run: () => Promise<T>,
): Promise<T | null> {
  try {
    return await run();
  } catch (e: unknown) {
    reportError(e);
    return null;
  }
}
