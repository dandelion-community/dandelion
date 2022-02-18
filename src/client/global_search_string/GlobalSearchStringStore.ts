import createStore from 'src/client/store/createStore';

const GlobalSearchStringStore = createStore<string>('');

export default GlobalSearchStringStore;
