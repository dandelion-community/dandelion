import createStore from 'src/client/store/createStore';
import { RootNavigationAllTypes } from '../NavigationTypes';

const RootNavigationStore = createStore<RootNavigationAllTypes | null>(null);

export default RootNavigationStore;
