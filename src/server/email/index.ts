import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const FROM_EMAIL = 'dandelioncommunityaid@gmail.com';
const PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  auth: {
    pass: PASSWORD,
    user: FROM_EMAIL,
  },
  service: 'gmail',
});

type Args = {
  emailAddress: string;
  subject: string;
  body: string;
};

async function send({ emailAddress, subject, body }: Args): Promise<void> {
  const args = {
    from: FROM_EMAIL,
    subject,
    text: body,
    to: emailAddress,
  };
  await transporter.sendMail(args);
}

export default {
  send,
};
