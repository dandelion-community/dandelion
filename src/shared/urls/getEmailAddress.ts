import getDomain from 'src/shared/urls/getDomain';

/**
 * SendGrid will complain if we use foo@localhost:3333 as
 * our "from" email address
 */
const DOMAIN = getDomain({ neverUseLocalhost: true });

export default function getEmailAddress({
  emailUser,
}: {
  emailUser: string;
}): string {
  const address = `${emailUser}@${DOMAIN}`;
  return address;
}
