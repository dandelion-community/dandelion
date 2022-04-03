import dotenv from 'dotenv';

dotenv.config();

type Args = {
  displayText: string;
  file: string;
  properties: Record<string, string>;
};

export default function throwError({
  displayText,
  file,
  properties,
}: Args): never {
  throw new Error(
    JSON.stringify({
      displayText,
      file,
      properties,
    }),
  );
}

type FakeArgs = Args & {
  suppression?: { suppressFakeErrors: boolean };
  probability?: number;
};

export function throwFakeErrorSometimes({
  displayText,
  file,
  properties,
  suppression,
  probability,
}: FakeArgs): void {
  if (
    process.env.MONGODB_DB_NAME === 'AidApp-Test' &&
    Math.random() < (probability ?? 0.1) &&
    !suppression?.suppressFakeErrors &&
    [2].includes(1)
  ) {
    throwError({
      displayText,
      file,
      properties,
    });
  }
}
