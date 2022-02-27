import { schemaComposer } from 'graphql-compose';
import { NotifiableEventOnAidRequestGraphQLType as NotifiableEventOnAidRequestGraphQLType_ } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import { NotificationMethodGraphQLType as NotificationMethodGraphQLType_ } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SubscribeOrUnsubscribeGraphQLType as SubscribeOrUnsubscribeGraphQLType_ } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';
import {
  AidRequestNotificationCurrentSettingForGraphQL,
  AidRequestNotificationSettingsTypeForGraphQL,
  ChangeNotificationSettingEventForGraphQL,
} from './AidRequestNotificationSettingsModelTypes';

export const NotifiableEventOnAidRequestGraphQLType =
  NotifiableEventOnAidRequestGraphQLType_;
export const NotificationMethodGraphQLType = NotificationMethodGraphQLType_;
export const SubscribeOrUnsubscribeGraphQLType =
  SubscribeOrUnsubscribeGraphQLType_;

export const AidRequestNotificationSettingsGraphQLType =
  schemaComposer.createObjectTC<AidRequestNotificationSettingsTypeForGraphQL>({
    fields: {
      aidRequest: 'AidRequest!',
      history: '[AidRequestChangeNotificationSettingEvent!]!',
      user: 'User!',
    },
    name: 'AidRequestNotificationSettings',
  });

const NotificationSettingDescriptorFields = {
  notifiableEvent: 'NotifiableEventOnAidRequest!',
  notificationMethod: 'NotificationMethod!',
  subscribeOrUnsubscribe: 'SubscribeOrUnsubscribe!',
};

export const AidRequestChangeNotificationSettingsEventGraphQLType =
  schemaComposer.createObjectTC<ChangeNotificationSettingEventForGraphQL>({
    fields: {
      ...NotificationSettingDescriptorFields,
      timestamp: 'Date!',
    },
    name: 'AidRequestChangeNotificationSettingsEvent',
  });

export const AidRequestNotificationCurrentSettingGraphQLType =
  schemaComposer.createObjectTC<AidRequestNotificationCurrentSettingForGraphQL>(
    {
      fields: {
        ...NotificationSettingDescriptorFields,
        reason: 'String!',
      },
      name: 'AidRequestChangeNotificationSettingsEvent',
    },
  );
