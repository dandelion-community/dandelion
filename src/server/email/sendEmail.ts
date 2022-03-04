import sendgridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { EmailTemplateType } from 'src/server/email/EmailTemplateTypes';
import getEmailAddress from 'src/shared/urls/getEmailAddress';

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
  const msg = {
    dynamicTemplateData: templateProps,
    from: FROM_EMAIL,
    templateId,
    to: recipient.username,
  };
  await sendgridMail.send(msg);
}
