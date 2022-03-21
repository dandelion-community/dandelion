import {
  ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS,
  NotifiableEventOnAidRequest,
} from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import {
  ALL_NOTIFICATION_METHODS,
  NotificationMethod,
} from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SubscribeOrUnsubscribe } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';

export type EventConfig = {
  description: string;
  notificationMethods: Record<
    NotificationMethod,
    {
      defaultValue: SubscribeOrUnsubscribe;
      // Whether the user should be subscribed to this event regardless
      // of whether they would otherwise be subscribed to the aid request.
      // E.g., for mentions, people should be notified even if they haven't
      // interacted with the aid request.
      isRegardlessOfSubscription: boolean;
    }
  >;
  // The header in AidRequestNotificationSettingsScreen for this event.
  // This is not shown for the "Any" event.
  settingsTitle: string;
  // You are subscribed to ____ on this requests
  shortNoun: string;
  // Omit the "on all requests" or "on requests you're subscribed to" part of the reason string
  omitContextString?: boolean;
};

type Config = Record<NotifiableEventOnAidRequest, EventConfig>;

const CONFIG: Config = {
  Any: {
    description: "You're subscribed to this request",
    notificationMethods: {
      Email: { defaultValue: 'Subscribe', isRegardlessOfSubscription: false },
    },
    settingsTitle: 'Updates',
    shortNoun: 'updates',
  },
  NewComment: {
    description: "Someone commented on a request you're subscribed to",
    notificationMethods: {
      Email: { defaultValue: 'Subscribe', isRegardlessOfSubscription: false },
    },
    settingsTitle: 'New Comments',
    shortNoun: 'new comments',
  },
  Reminder: {
    description: 'Reminder',
    notificationMethods: {
      Email: { defaultValue: 'Subscribe', isRegardlessOfSubscription: true },
    },
    omitContextString: true,
    settingsTitle: 'Reminders',
    shortNoun: "reminders about requests you're working on",
  },
  YouWereMentionedInAComment: {
    description: 'You were mentioned in a comment',
    notificationMethods: {
      Email: { defaultValue: 'Subscribe', isRegardlessOfSubscription: true },
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
