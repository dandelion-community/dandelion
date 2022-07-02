import { AidRequestReminderModel } from 'src/server/collections/aid_request_reminder/AidRequestReminderModel';
import executeReminder from 'src/server/collections/aid_request_reminder/executeReminder';
import setTimeoutSafe from 'src/server/utils/setTimeoutSafe';
import getErrorMessage from 'src/shared/utils/error/getErrorMessage';

export default async function executeReminders(): Promise<void> {
  const reminders = await AidRequestReminderModel.find({
    scheduledFor: { $lt: new Date() },
  });
  reminders.forEach((reminder) =>
    setTimeoutSafe('executeReminders:executeReminder', async () => {
      try {
        await executeReminder(reminder);
      } catch (e) {
        console.log('executeReminders error: ' + getErrorMessage(e));
      }
    }),
  );
}
