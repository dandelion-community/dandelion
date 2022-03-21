import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import sendEmail from 'src/server/email/sendEmail';
import checkNotificationSettingsAndMaybeNotify from 'src/server/notifications/helpers/checkNotificationSettingsAndMaybeNotify';
import getAidRequestTitle from 'src/shared/aid_request/getAidRequestTitle';
import aidRequestDetailUrl from 'src/shared/urls/aidRequestDetailUrl';
import aidRequestNotificationSettingsUrl from 'src/shared/urls/aidRequestNotificationSettingsUrl';
import { UserModel } from '../user/UserModel';
import {
  AidRequestReminderDeletedModel,
  AidRequestReminderModel,
} from './AidRequestReminderModel';
import { AidRequestReminderType } from './AidRequestReminderModelTypes';

export default async function executeReminder(
  reminder: AidRequestReminderType,
): Promise<void> {
  const user = await UserModel.findById(reminder.userID);
  if (user == null) {
    throw new Error('No user found for reminder ' + reminder._id.toString());
  }
  const aidRequestID = reminder.aidRequestID.toString();
  const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
  await checkNotificationSettingsAndMaybeNotify({
    args: {
      aidRequest,
      extraRecipientIDs: [reminder.userID.toString()],
      recipient: user,
    },
    notifiableEvent: 'Reminder',
    notificationMethod: 'Email',
    notify: async (reason: string) => {
      await sendEmail({
        recipient: user,
        templateID: 'REMINDER_NOTIFICATION_TEMPLATE_ID',
        templateProps: {
          aid_request_title: getAidRequestTitle(aidRequest),
          notification_reason: reason,
          notification_settings_url:
            aidRequestNotificationSettingsUrl(aidRequestID),
          reminder_reason:
            "This is a friendly reminder that you marked yourself as working on this request and it's been 7 days since your last activity. ",
          request_url: aidRequestDetailUrl(aidRequestID),
        },
      });
    },
  });
  await new AidRequestReminderDeletedModel({
    _id: reminder._id,
    aidRequestID: reminder.aidRequestID,
    howManyDays: reminder.howManyDays,
    scheduledFor: reminder.scheduledFor,
    userID: reminder.userID,
  }).save();
  await AidRequestReminderModel.findByIdAndDelete(reminder._id);
}
