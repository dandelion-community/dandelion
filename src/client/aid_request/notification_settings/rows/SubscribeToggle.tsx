import { useMutation } from '@apollo/client';
import * as React from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-paper';
import {
  NotifiableEventOnAidRequest,
  NotificationMethod,
  SubscribeOrUnsubscribe,
} from 'src/../__generated__/globalTypes';
import Row from 'src/client/aid_request/detail/components/Row';
import RowTitle from 'src/client/aid_request/detail/components/RowTitle';
import { CHANGE_NOTIFICATION_SETTINGS_MUTATION } from 'src/client/aid_request/notification_settings/helpers/ChangeNotificationSettingsMutation';
import type {
  AidRequestEditNotificationSettings,
  AidRequestEditNotificationSettingsVariables,
} from 'src/client/aid_request/notification_settings/helpers/__generated__/AidRequestEditNotificationSettings';
import Text from 'src/client/components/Text';

type Props = {
  aidRequestID: string;
  isSubscribed: boolean;
  reason: string;
};

export default function SubscribeToggle({
  aidRequestID,
  isSubscribed,
  reason,
}: Props): JSX.Element {
  const [runMutation, { error, loading }] = useMutation<
    AidRequestEditNotificationSettings,
    AidRequestEditNotificationSettingsVariables
  >(CHANGE_NOTIFICATION_SETTINGS_MUTATION);
  return (
    <Row divider={true}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <RowTitle extraBig={true}>Subscribe</RowTitle>
        <Switch
          disabled={loading}
          onValueChange={onValueChange}
          value={isSubscribed}
        />
      </View>
      <Text>{reason}</Text>
      <Text>{error}</Text>
    </Row>
  );

  function onValueChange(value: boolean): void {
    runMutation({
      variables: {
        aidRequestID,
        input: {
          notifiableEvent: NotifiableEventOnAidRequest.Any,
          notificationMethod: NotificationMethod.Email,
          subscribeOrUnsubscribe: value
            ? SubscribeOrUnsubscribe.Subscribe
            : SubscribeOrUnsubscribe.Unsubscribe,
        },
      },
    });
  }
}
