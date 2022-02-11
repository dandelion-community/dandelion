import email from 'src/server/email';
import { NotificationArgs } from 'src/server/notifications/NotificationTypes';

export default async function notifyViaEmail({
  recipient,
  subject,
  body,
}: NotificationArgs): Promise<void> {
  return await email.send({
    body,
    emailAddress: recipient.username,
    subject,
  });
}
