import getDomain from 'src/shared/urls/getDomain';

const DOMAIN = getDomain();

export default function getEmailAddress({
  emailUser,
}: {
  emailUser: string;
}): string {
  const address = `${emailUser}@${DOMAIN}`;
  return address;
}
