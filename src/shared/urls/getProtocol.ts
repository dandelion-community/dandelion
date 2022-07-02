import ENVIRONMENT_IS_USING_TEST_DATABASE from 'src/shared/env/ENVIRONMENT_IS_USING_TEST_DATABASE';

export default function getDomain(): string {
  if (ENVIRONMENT_IS_USING_TEST_DATABASE) {
    return 'http://';
  } else {
    return 'https://';
  }
}
