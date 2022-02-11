import { NotificationArgs } from 'src/server/notifications/NotificationTypes';
import notifyViaEmail from 'src/server/notifications/notifyViaEmail';

export default async function notify(args: NotificationArgs): Promise<void> {
  return await notifyViaEmail(args);
}
