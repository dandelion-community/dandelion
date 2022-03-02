import sendgridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { NotifySpecificRecipientArgs } from 'src/server/notifications/NotifyArgs';

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const NEW_COMMENT_NOTIFICATION_TEMPLATE_ID =
  process.env.NEW_COMMENT_NOTIFICATION_TEMPLATE_ID;
if (!sendgridApiKey) {
  throw new Error('env Must provide SENDGRID_API_KEY');
}

if (!NEW_COMMENT_NOTIFICATION_TEMPLATE_ID) {
  throw new Error('env Must provide NEW_COMMENT_NOTIFICATION_TEMPLATE_ID');
}

sendgridMail.setApiKey(sendgridApiKey);
const FROM_EMAIL = 'notifications@dandelion.supplies';

async function sendNewCommentEmail({
  aidRequest,
  comment,
  commenter,
  recipient,
}: NotifySpecificRecipientArgs): Promise<void> {
  const aidRequestID = aidRequest._id.toString();
  const msg = {
    dynamicTemplateData: {
      comment_value: comment.eventSpecificData ?? 'Unknown',
      commenter_name: commenter.displayName,
      notification_settings_url: `https://dandelion.supplies/r/notification_settings?id=${aidRequestID}`,
      request_url: `https://dandelion.supplies/r?id=${aidRequestID}`,
      what_is_needed: aidRequest.whatIsNeeded,
      who_is_it_for: aidRequest.whoIsItFor,
    },
    from: FROM_EMAIL,
    templateId: NEW_COMMENT_NOTIFICATION_TEMPLATE_ID as string,
    to: recipient.username,
  };
  await sendgridMail.send(msg);
}

export default {
  sendNewCommentEmail,
};
