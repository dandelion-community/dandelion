import getEnvironmentVariableAndThrowIfNotFound from './getEnvironmentVariableAndThrowIfNotFound';

const MONGODB_DB_NAME =
  getEnvironmentVariableAndThrowIfNotFound('MONGODB_DB_NAME');
const ENVIRONMENT_IS_USING_TEST_DATABASE = MONGODB_DB_NAME === 'AidApp-Test';

export default ENVIRONMENT_IS_USING_TEST_DATABASE;
