import getDomain from './getDomain';
import getProtocol from './getProtocol';

export default function getDomainAndProtocol(): string {
  return getProtocol() + getDomain();
}
