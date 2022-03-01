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
  }
>;

const CONFIG: Config = {
  NewComment: {
    description: "Someone commented on a request you're subscribed to",
    notificationMethods: {
      Email: { defaultValue: 'Subscribe' },
    },
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
