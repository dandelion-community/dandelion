import { createNativeStackNavigator } from '@react-navigation/native-stack';
import deepEqual from 'deep-equal';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import AidRequestDetailScreen from 'src/client/aid_request/detail/AidRequestDetailScreen';
import AidRequestDetailHeaderButtons from 'src/client/aid_request/detail/header/AidRequestDetailHeaderButtons';
import { AidRequestDetailsQuery_aidRequest } from 'src/client/aid_request/detail/__generated__/AidRequestDetailsQuery';
import RequestExplorerHeader from 'src/client/aid_request/explorer/RequestExplorerHeader';
import RequestExplorerScreen from 'src/client/aid_request/explorer/RequestExplorerScreen';
import AidRequestNotificationSettingsScreen from 'src/client/aid_request/notification_settings/AidRequestNotificationSettingsScreen';
import Header from 'src/client/components/Header';
import StackNavigatorInsideTabNavigator from 'src/client/navigation/helpers/StackNavigatorInsideTabNavigator';
import {
  RequestExplorerStackParamList,
  RequestExplorerStackScreenProps,
} from 'src/client/navigation/NavigationTypes';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import RequestExplorerNavigationStore from './navigation/RequestExplorerNavigationStore';

const Stack = createNativeStackNavigator<RequestExplorerStackParamList>();

export type ExtraProps = { navigateToProfile: () => void };

export default function RequestExplorerTabStackContainer(): JSX.Element {
  const [aidRequest, setAidRequest] = React.useState<
    AidRequestDetailsQuery_aidRequest | undefined
  >(undefined);
  const [notifSettingsAidRequestID, setNotifSettingsAidRequestID] =
    React.useState<string | undefined>(undefined);
  const AidRequestDetailScreenComponent = React.useCallback((props) => {
    return (
      <AidRequestDetailScreen
        {...props}
        setAidRequest={(
          newAidRequest: AidRequestDetailsQuery_aidRequest,
        ): void => {
          if (!deepEqual(aidRequest, newAidRequest)) {
            setAidRequest(newAidRequest);
          }
        }}
      />
    );
  }, []);
  const AidRequestNotificationSettingsScreenComponent = React.useCallback(
    (props) => {
      return (
        <AidRequestNotificationSettingsScreen
          {...props}
          setNotifSettingsAidRequestID={(
            newNotifSettingsAidRequestID: string,
          ): void => {
            if (notifSettingsAidRequestID !== newNotifSettingsAidRequestID) {
              setNotifSettingsAidRequestID(newNotifSettingsAidRequestID);
            }
          }}
        />
      );
    },
    [],
  );
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={wrapComponent(RequestExplorerScreen)}
          name="RequestExplorer"
          options={() => ({
            header: () => <RequestExplorerHeader />,
            title: 'All Requests',
          })}
        />
        <Stack.Screen
          component={wrapComponent(AidRequestDetailScreenComponent)}
          name="AidRequestDetail"
          options={() => ({
            header: ({ options }) => (
              <Header>
                <Appbar.BackAction onPress={goBack} />
                <Appbar.Content title={options.title} />
                <AidRequestDetailHeaderButtons aidRequest={aidRequest} />
              </Header>
            ),
            title: 'Request',
          })}
        />
        <Stack.Screen
          component={wrapComponent(
            AidRequestNotificationSettingsScreenComponent,
          )}
          name="AidRequestNotificationSettings"
          options={() => ({
            header: ({ options }) => (
              <Header>
                <Appbar.BackAction
                  onPress={() => {
                    const navigation =
                      RequestExplorerNavigationStore.getValue();
                    navigation?.canGoBack()
                      ? navigation?.goBack()
                      : notifSettingsAidRequestID == null
                      ? navigation?.replace('RequestExplorer')
                      : navigation?.replace('AidRequestDetail', {
                          id: notifSettingsAidRequestID,
                        });
                  }}
                />
                <Appbar.Content title={options.title} />
              </Header>
            ),
            title: 'Notification Settings',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );

  function wrapComponent<T extends keyof RequestExplorerStackParamList>(
    Component: (props: RequestExplorerStackScreenProps<T>) => JSX.Element,
  ): (props: RequestExplorerStackScreenProps<T>) => JSX.Element {
    return React.useCallback((props: RequestExplorerStackScreenProps<T>) => {
      const { navigation } = props;
      React.useEffect(() => {
        RequestExplorerNavigationStore.update(navigation);
      }, [navigation]);
      return (
        <RequireLoggedInScreen>
          <Component {...props} />
        </RequireLoggedInScreen>
      );
    }, []);
  }
}

function goBack(): void {
  const navigation = RequestExplorerNavigationStore.getValue();
  navigation?.canGoBack()
    ? navigation?.goBack()
    : navigation?.replace('RequestExplorer');
}
