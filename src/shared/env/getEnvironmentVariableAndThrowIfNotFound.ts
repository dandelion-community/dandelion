import dotenv from 'dotenv';

dotenv.config();

const env: NodeJS.ProcessEnv = process.env;

export default function getEnvironmentVariableAndThrowIfNotFound(
  environmentVariableName: string,
): string {
  const value = env[environmentVariableName];
  if (!value) {
    throw new Error(
      `${environmentVariableName} environment variable must be provided`,
    );
  }
  return value;
}
