import environmentIsUsingTestDatabase from 'src/shared/env/environmentIsUsingTestDatabase';

type Options = {
  neverUseLocalhost?: true;
};

export default function getDomain(options?: Options): string {
  if (environmentIsUsingTestDatabase() && !options?.neverUseLocalhost) {
    return 'localhost:3333';
  } else {
    return 'dandelion.supplies';
  }
}
