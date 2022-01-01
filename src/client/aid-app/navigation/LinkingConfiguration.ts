/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from './NavigationTypes';

const linking: LinkingOptions<RootStackParamList> = {
  config: {
    screens: {
      ['Create Account']: 'create_account',
      Login: 'login',
      Main: {
        screens: {
          CreateRequestTabStackContainer: {
            screens: {
              CreateRequest: 'create',
            },
          },
          RequestExplorerTabStackContainer: {
            screens: {
              RequestExplorer: '',
            },
          },
          ThreeLinesMenuTabStackContainer: {
            screens: {
              ThreeLinesMenu: 'menu',
            },
          },
        },
      },
      NotFound: '*',
      NotLoggedIn: 'loggedout',
    },
  },
  prefixes: [Linking.makeUrl('/')],
};

export default linking;
