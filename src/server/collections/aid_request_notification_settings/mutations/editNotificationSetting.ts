import getAidRequestNotificationSettings from 'src/server/collections/aid_request_notification_settings//helpers/getAidRequestNotificationSettings';
import { AidRequestChangeNotificationSettingsEventGraphQLType } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsGraphQLTypes';
import {
  ChangeNotificationSettingEvent,
  ChangeNotificationSettingEventForGraphQL,
} from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModelTypes';
import { NotifiableEventOnAidRequest } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import { NotificationMethod } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SubscribeOrUnsubscribe } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';
import graphqlifyAidRequestChangeNotificationSettingHistoryEvent from 'src/server/collections/aid_request_notification_settings/helpers/graphqlifyAidRequestChangeNotificationSettingHistoryEvent';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

async function editNotificationSettingResolver(
  _: unknown,
  {
    aidRequestID,
    notificationMethod,
    notifiableEvent,
    subscribeOrUnsubscribe,
  }: {
    aidRequestID: string;
    notificationMethod: NotificationMethod;
    notifiableEvent: NotifiableEventOnAidRequest;
    subscribeOrUnsubscribe: SubscribeOrUnsubscribe;
  },
  req: Express.Request,
): Promise<ChangeNotificationSettingEventForGraphQL> {
  const user = assertLoggedIn(req, 'Create aid request');
  let notificationSettings = await getAidRequestNotificationSettings(
    user,
    aidRequestID,
  );

  const event: ChangeNotificationSettingEvent = {
    notifiableEvent,
    notificationMethod,
    subscribeOrUnsubscribe,
    timestamp: new Date(),
  };

  notificationSettings = await notificationSettings.update(
    {
      $push: { history: event },
    },
    { new: true },
  );

  if (notificationSettings == null) {
    throw new Error('Unable to udpate notification settings');
  }

  return graphqlifyAidRequestChangeNotificationSettingHistoryEvent({
    event,
    notificationSettings,
    user,
  });
}

const editNotificationSetting = {
  args: {
    aidRequestID: 'String!',
    notifiableEvent: 'NotifiableEventOnAidRequest!',
    notificationMethod: 'NotificationMethod!',
    subscribeOrUnsubscribe: 'SubscribeOrUnsubscribe!',
  },
  resolve: editNotificationSettingResolver,
  type: AidRequestChangeNotificationSettingsEventGraphQLType,
};

export default editNotificationSetting;
