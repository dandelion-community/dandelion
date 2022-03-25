import createStore from 'src/client/store/createStore';
import useStore from 'src/client/store/useStore';
import { RootNavigationAllTypes } from '../NavigationTypes';

const RootNavigationStore = createStore<RootNavigationAllTypes | null>(null);

export default RootNavigationStore;

export function useEncodedRootNavigationStoreForErrorReporting(): string {
  const navState = useStore(RootNavigationStore)?.getState();
  if (navState == null) {
    return 'null';
  } else {
    return JSON.stringify(navState.routes);
  }
}
