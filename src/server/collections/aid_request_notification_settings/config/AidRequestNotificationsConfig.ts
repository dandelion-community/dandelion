import {
  ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS,
  NotifiableEventOnAidRequest,
} from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import {
  ALL_NOTIFICATION_METHODS,
  NotificationMethod,
} from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SubscribeOrUnsubscribe } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';

type Config = Record<
  NotifiableEventOnAidRequest,
  {
    description: string;
    notificationMethods: Record<
      NotificationMethod,
      {
        defaultValue: SubscribeOrUnsubscribe;
      }
    >;
    // The header in AidRequestNotificationSettingsScreen for this event.
    // This is not shown for the "Any" event.
    settingsTitle: string;
    // You are subscribed to ____ on this requests
    shortNoun: string;
  }
>;

const CONFIG: Config = {
  Any: {
    description: "You're subscribed to this request",
    notificationMethods: {
      Email: { defaultValue: 'Subscribe' },
    },
    settingsTitle: 'Updates',
    shortNoun: 'updates',
  },
  NewComment: {
    description: "Someone commented on a request you're subscribed to",
    notificationMethods: {
      Email: { defaultValue: 'Subscribe' },
    },
    settingsTitle: 'New Comments',
    shortNoun: 'new comments',
  },
  YouWereMentionedInAComment: {
    description: 'You were mentioned in a comment',
    notificationMethods: {
      Email: { defaultValue: 'Subscribe' },
    },
    settingsTitle: 'Comment Mentions',
    shortNoun: 'comment mentions',
  },
};

export function validate(): void {
  ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS.forEach((notifiableEvent) => {
    const eventConfig = CONFIG[notifiableEvent];
    if (eventConfig == null) {
      throw new Error(
        'AidRequestNotificationsConfig must define a config for ' +
          notifiableEvent,
      );
    }
    ALL_NOTIFICATION_METHODS.forEach((notificationMethod) => {
      const notificationMethodConfig =
        eventConfig.notificationMethods[notificationMethod];
      if (notificationMethodConfig == null) {
        throw new Error(
          `AidRequestNotificationsConfig[${notifiableEvent}] must define a config for ${notificationMethod}`,
        );
      }
    });
  });
}

export default CONFIG;
