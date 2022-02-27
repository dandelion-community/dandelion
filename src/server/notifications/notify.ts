import sendNotificationsAboutNewCommentOnAidRequest from 'src/server/notifications/new_comment/sendNotificationsAboutNewCommentOnAidRequest';
import type { NotifyArgs } from 'src/server/notifications/NotifyArgs';
import afterRequestIsComplete from 'src/server/utils/afterRequestIsComplete';

export default function notify(args: NotifyArgs): void {
  afterRequestIsComplete(args.req, () => notifyImpl(args));
}

function notifyImpl(args: NotifyArgs): void {
  switch (args.type) {
    case 'NewComment':
      sendNotificationsAboutNewCommentOnAidRequest(args);
  }
}
