import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import AID_REQUEST_DETAIL_PATH from 'src/shared/urls/AID_REQUEST_DETAIL_PATH';
import AID_REQUEST_NOTIFICATION_SETTINGS_PATH from 'src/shared/urls/AID_REQUEST_NOTIFICATION_SETTINGS_PATH';
import { RootStackParamList } from './NavigationTypes';

const linking: LinkingOptions<RootStackParamList> = {
  config: {
    screens: {
      ['Create Account']: 'create_account',
      Login: 'login',
      Main: {
        screens: {
          MenuTabStackContainer: {
            screens: {
              ThreeLinesMenu: 'menu',
            },
          },
          RequestExplorerTabStackContainer: {
            screens: {
              AidRequestDetail: AID_REQUEST_DETAIL_PATH,
              AidRequestNotificationSettings:
                AID_REQUEST_NOTIFICATION_SETTINGS_PATH,
              RequestExplorer: '',
            },
          },
        },
      },
      NotFound: '*',
      NotLoggedIn: 'loggedout',
      ['Record Request']: 'new',
    },
  },
  prefixes: [Linking.createURL('/')],
};

export default linking;
