import environmentIsUsingTestDatabase from 'src/shared/env/environmentIsUsingTestDatabase';

export default function getDomain(): string {
  if (environmentIsUsingTestDatabase()) {
    return 'http://';
  } else {
    return 'https://';
  }
}
