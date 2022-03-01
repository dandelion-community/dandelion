import { RequestExplorerNavigationAllTypes } from 'src/client/navigation/NavigationTypes';
import createStore from 'src/client/store/createStore';

const RequestExplorerNavigationStore =
  createStore<RequestExplorerNavigationAllTypes | null>(null);

export default RequestExplorerNavigationStore;
