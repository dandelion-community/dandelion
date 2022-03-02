import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import {
  AidRequestHistoryEventType,
  PRIORITY_HISTORY_EVENTS,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import getHistoryWithoutRemovals from 'src/server/collections/aid_request/helpers/getHistoryWithoutRemovals';
import { maybeLoadAidRequestForViewer } from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { AidRequestNotificationSettings } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModel';
import {
  AidRequestNotificationCurrentSettingForGraphQL,
  ChangeNotificationSettingEvent,
} from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModelTypes';
import AidRequestNotificationsConfig from 'src/server/collections/aid_request_notification_settings/config/AidRequestNotificationsConfig';
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
  const title = AidRequestNotificationsConfig[notifiableEvent].settingsTitle;
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

  return await getCurrentSettingForNotificationOnAidRequestImpl(
    notifiableEvent,
    notificationMethod,
    notificationSettings,
    user,
    aidRequest,
    title,
  );

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
      title,
    };
  }
}

type Status = {
  isSubscribed: boolean;
  reason: string;
};

async function getCurrentSettingForNotificationOnAidRequestImpl(
  notifiableEvent: NotifiableEventOnAidRequest,
  notificationMethod: NotificationMethod,
  notificationSettings: AidRequestNotificationSettings,
  user: Express.User,
  aidRequest: AidRequest,
  title: string,
): Promise<AidRequestNotificationCurrentSettingForGraphQL> {
  let requestStatus: Status = getInitialRequestStatus();
  let eventStatus: Status = getInitialEventStatus();

  const relevantHistoryEvents = notificationSettings.history
    .filter(
      ({
        notifiableEvent: historyNotifiableEvent,
        notificationMethod: historyNotificationMethod,
      }: ChangeNotificationSettingEvent): boolean => {
        return (
          (notifiableEvent === historyNotifiableEvent ||
            historyNotifiableEvent === 'Any') &&
          notificationMethod === historyNotificationMethod
        );
      },
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Replay history so we get the most up-to-date setting
  relevantHistoryEvents.forEach(
    ({
      notifiableEvent: historyNotifiableEvent,
      subscribeOrUnsubscribe,
      timestamp,
    }: ChangeNotificationSettingEvent): void => {
      const isSubscribed: boolean = subscribeOrUnsubscribe === 'Subscribe';
      if (historyNotifiableEvent === 'Any') {
        requestStatus = {
          isSubscribed,
          reason: getRequestStatusReason(
            isSubscribed,
            `you changed this setting ${ago(timestamp)}`,
          ),
        };
      } else {
        eventStatus = {
          isSubscribed,
          reason: getEventStatusReason(
            isSubscribed,
            `you changed this setting ${ago(timestamp)}`,
            { isDefault: false },
          ),
        };
      }
    },
  );

  if (!requestStatus.isSubscribed || notifiableEvent === 'Any') {
    return createResult(requestStatus.isSubscribed, requestStatus.reason);
  } else {
    return createResult(eventStatus.isSubscribed, eventStatus.reason);
  }

  function getInitialRequestStatus(): {
    isSubscribed: boolean;
    reason: string;
  } {
    const history = getHistoryWithoutRemovals(aidRequest);
    const actions = history.filter(
      ({ actor }) => actor.toString() === user._id.toString(),
    );
    const isSubscribed: boolean = actions.length > 0;
    if (!isSubscribed) {
      return {
        isSubscribed,
        reason: getRequestStatusReason(
          isSubscribed,
          'this is the default setting',
        ),
      };
    }

    const mainReasonEvent = actions.reduce((a, b) => {
      return PRIORITY_HISTORY_EVENTS.indexOf(b.event) <
        PRIORITY_HISTORY_EVENTS.indexOf(a.event)
        ? b
        : a;
    }, actions[0]);
    return {
      isSubscribed: true,
      reason: getRequestStatusReason(
        true,
        `you ${getStatusText(mainReasonEvent.event)} it`,
      ),
    };
  }

  function getInitialEventStatus(): {
    isSubscribed: boolean;
    reason: string;
  } {
    const subscribeOrUnsubscribe = getDefaultNotificationSetting({
      notifiableEvent,
      notificationMethod,
    });
    const isSubscribed = subscribeOrUnsubscribe === 'Subscribe';
    return {
      isSubscribed,
      reason: getEventStatusReason(
        isSubscribed,
        'this is the default setting',
        { isDefault: true },
      ),
    };
  }

  function getRequestStatusReason(isSubscribed: boolean, why: string): string {
    return `You are ${
      isSubscribed ? '' : 'not '
    }subscribed to updates on this request because ${why}`;
  }

  function getEventStatusReason(
    isSubscribed: boolean,
    why: string,
    { isDefault }: { isDefault: boolean },
  ): string {
    return `You are ${isSubscribed ? '' : 'not '}subscribed to ${
      AidRequestNotificationsConfig[notifiableEvent].shortNoun
    } on ${
      isDefault ? "requests you're subscribed to" : 'this request'
    } because ${why}`;
  }

  function createResult(
    isSubscribed: boolean,
    reason: string,
  ): AidRequestNotificationCurrentSettingForGraphQL {
    return {
      notifiableEvent,
      notificationMethod,
      reason,
      subscribeOrUnsubscribe: isSubscribed ? 'Subscribe' : 'Unsubscribe',
      title,
    };
  }
}

function getStatusText(event: AidRequestHistoryEventType): string {
  // You are subscribed to this event because you ____ it
  switch (event) {
    case 'WorkingOn':
      return 'are working on';
    case 'Completed':
      return 'completed';
    case 'Created':
      return 'created';
    case 'Deleted':
      return 'deleted';
    case 'Comment':
      return 'commented on';
    case 'ChangedWhatIsNeeded':
    case 'ChangedWhoIsItFor':
      return 'edited';
  }
}
