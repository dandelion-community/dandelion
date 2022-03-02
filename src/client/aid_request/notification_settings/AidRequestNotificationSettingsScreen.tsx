import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import Row from 'src/client/aid_request/detail/components/Row';
import RowTitle from 'src/client/aid_request/detail/components/RowTitle';
import useSetRequestExplorerNavigation from 'src/client/aid_request/explorer/navigation/useSetRequestExplorerNavigation';
import { AidRequestCardFragments } from 'src/client/aid_request/fragments/AidRequestCardFragments';
import {
  AidRequestNotificationSettingsQuery,
  AidRequestNotificationSettingsQueryVariables,
  AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_settings,
} from 'src/client/aid_request/notification_settings/__generated__/AidRequestNotificationSettingsQuery';
import ErrorScreen from 'src/client/components/ErrorScreen';
import LoadingScreen from 'src/client/components/LoadingScreen';
import View from 'src/client/components/View';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import { AidRequestNotificationSettingsFragment } from './helpers/AidRequestNotificationSettingsFragment';
import Header from './rows/Header';
import SubscribeToggle from './rows/SubscribeToggle';

export type GoToRequestDetailScreen = (aidRequestID: string) => void;

type Item = {
  render: () => React.ReactElement;
  key: string;
};

type Props = RequestExplorerStackScreenProps<'AidRequestDetail'> & {
  setNotifSettingsAidRequestID: (aidRequestID: string) => void;
};

export default function AidRequestNotificationSettingsScreenWrapper(
  props: Props,
): JSX.Element {
  useSetRequestExplorerNavigation(props.navigation);
  return (
    <RequireLoggedInScreen>
      <AidRequestNotificationSettingsScreen {...props} />
    </RequireLoggedInScreen>
  );
}

function AidRequestNotificationSettingsScreen({
  route,
  setNotifSettingsAidRequestID,
}: Props): JSX.Element {
  const { id: aidRequestID } = route.params;
  React.useEffect(() => {
    setNotifSettingsAidRequestID(aidRequestID);
  }, [aidRequestID]);
  const { data, loading, error, refetch } = useQuery<
    AidRequestNotificationSettingsQuery,
    AidRequestNotificationSettingsQueryVariables
  >(AID_REQUEST_NOTIFICATION_SETTINGS_QUERY, {
    variables: { aidRequestID },
  });
  const items = getListItems(data);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollableScreen
      configs={
        error
          ? [
              singleElement({
                key: 'error',
                render: () => <ErrorScreen error={error} />,
              }),
            ]
          : [
              {
                onRefresh: refetch,
                refreshing: loading,
                section: {
                  data: items,
                  key: 'list-items',
                },
              },
            ]
      }
    />
  );
}

function getListItems(
  data: AidRequestNotificationSettingsQuery | undefined,
): Array<Item> {
  const notificationSettings = data?.aidRequestNotificationSettings;
  if (notificationSettings == null) {
    return [];
  }
  const { aidRequest, settings } = notificationSettings;
  const aidRequestID = aidRequest._id;
  const anySetting = settings.filter(
    (setting) => setting.notifiableEvent === 'Any',
  )[0];
  const isSubscribed = anySetting.subscribeOrUnsubscribe === 'Subscribe';
  const otherSettings = settings.filter(
    (s) => isSubscribed && s !== anySetting,
  );
  return [
    {
      key: `${aidRequestID}-header`,
      render: () => {
        return <Header aidRequest={aidRequest} />;
      },
    },
    {
      key: `${aidRequestID}-subscribe-toggle`,
      render: () => {
        return (
          <SubscribeToggle
            aidRequestID={aidRequestID}
            isSubscribed={isSubscribed}
            reason={anySetting.reason}
          />
        );
      },
    },
    ...(otherSettings.length <= 1
      ? []
      : otherSettings.map(
          (
            currentSetting: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_settings,
          ): Item => {
            return {
              key:
                'current-setting-' +
                currentSetting.notifiableEvent +
                '.' +
                currentSetting.notificationMethod,
              render: () => {
                return (
                  <Row>
                    <RowTitle>{currentSetting.reason}</RowTitle>
                  </Row>
                );
              },
            };
          },
        )),
    {
      key: 'bottom-spacer',
      render: () => {
        return <View style={{ height: 75 }} />;
      },
    },
  ];
}

const AID_REQUEST_NOTIFICATION_SETTINGS_QUERY = gql`
  query AidRequestNotificationSettingsQuery($aidRequestID: String!) {
    aidRequestNotificationSettings(aidRequestID: $aidRequestID) {
      aidRequest {
        ...AidRequestCardFragment
      }
      ...AidRequestNotificationSettingsFragment
    }
  }
  ${AidRequestCardFragments.aidRequest}
  ${AidRequestNotificationSettingsFragment}
`;
