import ENVIRONMENT_IS_USING_TEST_DATABASE from 'src/shared/env/ENVIRONMENT_IS_USING_TEST_DATABASE';

type Options = {
  neverUseLocalhost?: true;
};

export default function getDomain(options?: Options): string {
  if (ENVIRONMENT_IS_USING_TEST_DATABASE && !options?.neverUseLocalhost) {
    return 'localhost:3333';
  } else {
    return 'dandelion.supplies';
  }
}
