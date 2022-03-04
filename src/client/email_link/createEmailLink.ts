import getEmailAddress from 'src/shared/urls/getEmailAddress';

export type Props = {
  body?: string[];
  emailUser: string;
  subject: string;
};

const NEWLINE = '%0D%0A';

export default function createEmailLink(props: Props): string {
  const { body, subject } = props;
  const address = getEmailAddress(props);

  const link = [
    'mailto:',
    address,
    '?',
    'subject=' + subject,
    body ? '&body=' + body.join(NEWLINE) : '',
  ].join('');

  return link;
}
