import * as React from 'react';
import type { LoadingType } from 'src/client/utils/Loading';
import Loading from 'src/client/utils/Loading';

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
