import * as React from 'react';
import type { LoadingType } from './loading';
import Loading from './loading';

type UsedPromise<T> = LoadingType | Error | T;

export default function usePromise<T>(
  getPromise: () => Promise<T>,
  deps: Array<unknown>,
): UsedPromise<T> {
  const [val, setVal] = React.useState<UsedPromise<T>>(Loading);
  React.useEffect(() => {
    setVal(Loading);
    try {
      getPromise()
        .then((v) => setVal(v))
        .catch((e) => setVal(e));
    } catch (error: unknown) {
      setVal(error as Error);
    }
  }, deps);
  return val;
}
