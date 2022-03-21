import { AidRequestReminderModel } from 'src/server/collections/aid_request_reminder/AidRequestReminderModel';
import executeReminder from 'src/server/collections/aid_request_reminder/executeReminder';

export default async function executeReminders(): Promise<void> {
  const reminders = await AidRequestReminderModel.find({
    scheduledFor: { $lt: new Date() },
  });
  reminders.forEach((reminder) =>
    setTimeout(() => {
      try {
        executeReminder(reminder);
      } catch (e) {
        console.error(e);
      }
    }),
  );
}
