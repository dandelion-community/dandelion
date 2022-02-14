import * as React from 'react';
import type { Store } from 'src/client/store/StoreType';

export default function useStore<T>(store: Store<T>): T {
  const [value, setValue] = React.useState<T>(store.getValue);
  React.useEffect(() => {
    store.subscribe(setValue);
    return () => store.unsubscribe(setValue);
  }, [store]);
  return value;
}
