import type { ObjectId } from 'mongodb';
import { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import type { NotifiableEventOnAidRequest } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import type { NotificationMethod } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SubscribeOrUnsubscribe } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';

type NotificationSettingDescriptor = {
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
  subscribeOrUnsubscribe: SubscribeOrUnsubscribe;
};

export type ChangeNotificationSettingEvent = NotificationSettingDescriptor & {
  timestamp: Date;
};

export type ChangeNotificationSettingEventForGraphQL =
  ChangeNotificationSettingEvent & {
    settings: () => Promise<AidRequestNotificationSettingsTypeForGraphQL>;
  };

export type AidRequestNotificationSettingsType = {
  _id: string;
  aidRequestID: ObjectId;
  history: ChangeNotificationSettingEvent[];
  userID: ObjectId;
};

export type AidRequestNotificationCurrentSettingForGraphQL =
  NotificationSettingDescriptor & {
    reason: string;
  };

export type AidRequestNotificationSettingsTypeForGraphQL = {
  aidRequest: () => Promise<AidRequestType | null>;
  history: ChangeNotificationSettingEventForGraphQL[];
  settings: () => Promise<AidRequestNotificationCurrentSettingForGraphQL[]>;
  user: () => Promise<Express.User>;
};
