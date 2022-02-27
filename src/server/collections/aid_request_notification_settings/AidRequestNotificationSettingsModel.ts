import { Document, model, Schema } from 'mongoose';
import { AidRequestReference } from 'src/server/collections/aid_request/AidRequestModelTypes';
import {
  AidRequestNotificationSettingsType,
  ChangeNotificationSettingEvent,
} from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModelTypes';
import { NOTIFIABLE_EVENTS_ON_AID_REQUESTS_MONGOOSE_ENUM } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import { NOTIFICATION_METHOD_MONGOOSE_ENUM } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SUBSCRIBE_OR_UNSUBSCRIBE_MONGOOSE_ENUM } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';
import { UserReference } from 'src/server/collections/user/UserModelTypes';

const ChangeNotificationSettingEventSchema =
  new Schema<ChangeNotificationSettingEvent>({
    notifiableEvent: NOTIFIABLE_EVENTS_ON_AID_REQUESTS_MONGOOSE_ENUM,
    notificationMethod: NOTIFICATION_METHOD_MONGOOSE_ENUM,
    subscribeOrUnsubscribe: SUBSCRIBE_OR_UNSUBSCRIBE_MONGOOSE_ENUM,
    timestamp: Date,
  });

const AidRequestNotificationSettingsSchema =
  new Schema<AidRequestNotificationSettingsType>({
    aidRequestID: AidRequestReference,
    history: [ChangeNotificationSettingEventSchema],
    userID: UserReference,
  });

export const AidRequestNotificationSettingsModel =
  model<AidRequestNotificationSettingsType>(
    'AidRequestNotificationSetting',
    AidRequestNotificationSettingsSchema,
  );

export type AidRequestNotificationSettings = Document<
  unknown,
  unknown,
  AidRequestNotificationSettingsType
> &
  AidRequestNotificationSettingsType;
