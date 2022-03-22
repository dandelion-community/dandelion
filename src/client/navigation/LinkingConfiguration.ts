import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import AID_REQUEST_DETAIL_PATH from 'src/shared/urls/AID_REQUEST_DETAIL_PATH';
import AID_REQUEST_NOTIFICATION_SETTINGS_PATH from 'src/shared/urls/AID_REQUEST_NOTIFICATION_SETTINGS_PATH';
import PASSWORD_RESET_PATH from 'src/shared/urls/PASSWORD_RESET_PATH';
import { RootStackParamList } from './NavigationTypes';

const linking: LinkingOptions<RootStackParamList> = {
  config: {
    screens: {
      ['Create Account']: 'create_account',
      CreationTypeSelection: 'new',
      Login: 'login',
      Main: {
        screens: {
          MenuTabStackContainer: {
            screens: {
              Menu: 'menu',
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
      ['Record Multi Person Request']: 'new/m',
      ['Record Multi Person Request Part 2']: 'new/m/2',
      ['Record Request']: 'new/i',
      ResetPassword: PASSWORD_RESET_PATH,
    },
  },
  prefixes: [Linking.createURL('/')],
};

export default linking;
