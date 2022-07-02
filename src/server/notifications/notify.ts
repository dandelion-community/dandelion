import sendNotificationsAboutNewCommentOnAidRequest from 'src/server/notifications/new_comment/sendNotificationsAboutNewCommentOnAidRequest';
import type { NotifyArgs } from 'src/server/notifications/NotifyArgs';
import afterRequestIsComplete from 'src/server/utils/afterRequestIsComplete';

export default function notify(args: NotifyArgs): void {
  afterRequestIsComplete({
    callback: () => notifyImpl(args),
    loggingTag: 'notify:notifyImpl',
    req: args.req,
  });
}

function notifyImpl(args: NotifyArgs): void {
  switch (args.type) {
    case 'NewComment':
      sendNotificationsAboutNewCommentOnAidRequest(args);
  }
}
