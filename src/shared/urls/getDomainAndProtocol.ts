import getDomain from './getDomain';

export default function getDomainAndProtocol(): string {
  return 'https://' + getDomain();
}
