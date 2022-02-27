import { maybeLoadAidRequestForViewer } from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { AidRequestNotificationSettings } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModel';
import {
  AidRequestNotificationCurrentSettingForGraphQL,
  ChangeNotificationSettingEvent,
} from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModelTypes';
import { NotifiableEventOnAidRequest } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import { NotificationMethod } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import getDefaultNotificationSetting from 'src/server/collections/aid_request_notification_settings/helpers/getDefaultNotificationSetting';
import { UserModel } from 'src/server/collections/user/UserModel';
import ago from 'src/shared/utils/ago';

type Args = {
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
  notificationSettings: AidRequestNotificationSettings;
};

export default async function getCurrentSettingForNotificationOnAidRequest({
  notifiableEvent,
  notificationMethod,
  notificationSettings,
}: Args): Promise<AidRequestNotificationCurrentSettingForGraphQL> {
  const user = await UserModel.findById(notificationSettings.userID);
  if (user == null) {
    return error();
  }
  const aidRequest = await maybeLoadAidRequestForViewer(
    user,
    notificationSettings.aidRequestID.toString(),
  );
  if (aidRequest == null) {
    return error();
  }

  const latestHistoryEvent = notificationSettings.history
    .filter(
      ({
        notifiableEvent: historyNotifiableEvent,
        notificationMethod: historyNotificationMethod,
      }: ChangeNotificationSettingEvent): boolean => {
        return (
          notifiableEvent === historyNotifiableEvent &&
          notificationMethod === historyNotificationMethod
        );
      },
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  if (latestHistoryEvent != null) {
    const { subscribeOrUnsubscribe, timestamp } = latestHistoryEvent;
    return {
      notifiableEvent,
      notificationMethod,
      reason: 'You changed this setting ' + ago(timestamp),
      subscribeOrUnsubscribe,
    };
  }

  return getDefaultSetting({
    notifiableEvent,
    notificationMethod,
  });

  function error(): AidRequestNotificationCurrentSettingForGraphQL {
    return doNotNotify('There was a problem loading the notification settings');
  }

  function doNotNotify(
    reason: string,
  ): AidRequestNotificationCurrentSettingForGraphQL {
    return {
      notifiableEvent,
      notificationMethod,
      reason,
      subscribeOrUnsubscribe: 'Unsubscribe',
    };
  }
}

function getDefaultSetting({
  notifiableEvent,
  notificationMethod,
}: {
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
}): AidRequestNotificationCurrentSettingForGraphQL {
  const subscribeOrUnsubscribe = getDefaultNotificationSetting({
    notifiableEvent,
    notificationMethod,
  });
  return {
    notifiableEvent,
    notificationMethod,
    reason: 'This is the default setting',
    subscribeOrUnsubscribe,
  };
}
