import sendgridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { EmailTemplateType } from 'src/server/email/EmailTemplateTypes';
import getEmailAddress from 'src/shared/urls/getEmailAddress';
import analytics from '../analytics/index';

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;

if (!sendgridApiKey) {
  throw new Error('env Must provide SENDGRID_API_KEY');
}

sendgridMail.setApiKey(sendgridApiKey);

type Args = EmailTemplateType & {
  recipient: Express.User;
};

const FROM_EMAIL = getEmailAddress({ emailUser: 'notifications' });

export default async function sendEmail({
  templateID,
  templateProps,
  recipient,
}: Args) {
  const templateId = process.env[templateID];
  if (templateId == null) {
    throw new Error('Template ID not defined in .env: ' + templateID);
  }
  analytics.track({
    event: 'Sending Email',
    properties: {
      ...templateProps,
      templateID,
    },
    user: recipient,
  });
  const msg = {
    dynamicTemplateData: templateProps,
    from: FROM_EMAIL,
    templateId,
    to: recipient.username,
  };
  try {
    await sendgridMail.send(msg);
  } catch (e) {
    analytics.track({
      event: 'Send Email Failed',
      properties: {
        errors: tryToGetErrorsFromSendgridResponse(e),
      },
      user: recipient,
    });
  }
}

function tryToGetErrorsFromSendgridResponse(e: unknown): string {
  return JSON.stringify(
    (e as { response: { body: { errors: unknown } } }).response.body.errors,
  );
}
