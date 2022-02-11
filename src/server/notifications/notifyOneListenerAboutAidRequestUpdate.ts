import notify from 'src/server/notifications/notify';

type Args = {
  recipient: Express.User;
  recipientReason: string;
  subjectAction: string;
  subjectContent: string;
  subjectUser: Express.User;
};

export default async function notifyOneListenerAboutAidRequestUpdate({
  recipient,
  recipientReason,
  subjectAction,
  subjectContent,
  subjectUser,
}: Args): Promise<void> {
  const subject = `🌼 ${subjectUser.displayName} ${subjectAction} on a request you ${recipientReason}`;
  const body = subjectContent;
  await notify({ body, recipient, subject });
}
