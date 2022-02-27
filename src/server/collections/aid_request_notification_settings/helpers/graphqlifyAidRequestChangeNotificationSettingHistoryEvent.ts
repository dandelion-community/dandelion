import { AidRequestNotificationSettings } from '../AidRequestNotificationSettingsModel';
import {
  ChangeNotificationSettingEvent,
  ChangeNotificationSettingEventForGraphQL,
} from '../AidRequestNotificationSettingsModelTypes';
import graphqlifyAidRequestNotificationSettings from './graphqlifyAidRequestNotificationSettings';

export default function graphqlifyHistoryEvent({
  user,
  event,
  notificationSettings,
}: {
  user: Express.User;
  event: ChangeNotificationSettingEvent;
  notificationSettings: AidRequestNotificationSettings;
}): ChangeNotificationSettingEventForGraphQL {
  return {
    ...event,
    settings: async () =>
      graphqlifyAidRequestNotificationSettings(user, notificationSettings),
  };
}
