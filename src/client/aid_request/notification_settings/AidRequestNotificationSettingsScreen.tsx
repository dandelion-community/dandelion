import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import { AidRequestCardFragments } from 'src/client/aid_request/fragments/AidRequestCardFragments';
import {
  AidRequestNotificationSettingsQuery,
  AidRequestNotificationSettingsQueryVariables,
  AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_settings,
} from 'src/client/aid_request/notification_settings/__generated__/AidRequestNotificationSettingsQuery';
import ErrorNotice from 'src/client/components/ErrorNotice';
import LoadingScreen from 'src/client/components/LoadingScreen';
import View from 'src/client/components/ViewWithBackground';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import AidRequestUpdatedIDsEventStream from '../cache/AidRequestUpdatedIDsEventStream';
import { validate } from '../fragments/AidRequestGraphQLType';
import { AidRequestNotificationSettingsFragment } from './helpers/AidRequestNotificationSettingsFragment';
import CurrentSettingToggle from './rows/CurrentSettingToggle';
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

export default function AidRequestNotificationSettingsScreen({
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
  React.useEffect(() => {
    if (needsRefetch) {
      refetch();
      needsRefetch = false;
    }
  }, []);
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
                render: () => (
                  <ErrorNotice
                    error={error}
                    manualChange={`Manage notification settings for ${aidRequestID}`}
                    whenTryingToDoWhat="Load notification settings"
                  />
                ),
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
  const { aidRequest: aidRequest_, settings } = notificationSettings;
  const aidRequest = validate(aidRequest_);
  if (aidRequest == null) {
    return [];
  }
  const aidRequestID = aidRequest._id;
  const anySetting = settings.filter(
    (setting) => setting.notifiableEvent === 'Any',
  )[0];
  const isSubscribed = anySetting.subscribeOrUnsubscribe === 'Subscribe';
  const otherSettings = settings.filter(
    (s) => (isSubscribed || !s.onlyIfSubscribedToRequest) && s !== anySetting,
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
    ...otherSettings.map(
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
              <CurrentSettingToggle
                aidRequestID={aidRequestID}
                isSubscribed={
                  currentSetting.subscribeOrUnsubscribe === 'Subscribe'
                }
                notifiableEvent={currentSetting.notifiableEvent}
                reason={currentSetting.reason}
                title={currentSetting.title}
              />
            );
          },
        };
      },
    ),
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

let needsRefetch = false;

AidRequestUpdatedIDsEventStream.subscribe((): void => {
  needsRefetch = true;
});
