/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
  config: {
    screens: {
      ['Create Account']: 'create_account',
      Login: 'login',
      Main: {
        screens: {
          Home: {
            screens: {
              CreateRequest: 'create',
              HomeRoot: '',
              PersonDetails: 'person',
            },
          },
          Profile: 'profile',
        },
      },
      NotFound: '*',
      NotLoggedIn: 'loggedout',
    },
  },
  prefixes: [Linking.makeUrl('/')],
};

export default linking;
