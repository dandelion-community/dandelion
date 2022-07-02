import getEnvironmentVariableAndReturnUndefinedIfNotFound from './getEnvironmentVariableAndReturnUndefinedIfNotFound';

export default function environmentIsUsingHotReloading(): boolean {
  return (
    getEnvironmentVariableAndReturnUndefinedIfNotFound('HOT_RELOAD') === 'True'
  );
}
