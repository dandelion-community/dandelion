import dotenv from 'dotenv';

dotenv.config();

const env: NodeJS.ProcessEnv = process.env;

export default function getEnvironmentVariableAndReturnUndefinedIfNotFound(
  environmentVariableName: string,
): string | undefined {
  return env[environmentVariableName];
}
