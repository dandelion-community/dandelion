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
  username: string;
  subject: string;
  body: string;
};

async function send({ username, subject, body }: Args): Promise<void> {
  await transporter.sendMail({
    from: FROM_EMAIL,
    subject,
    text: body,
    to: username,
  });
}

export default {
  send,
};
