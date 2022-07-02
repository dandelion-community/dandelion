import ENVIRONMENT_IS_USING_TEST_DATABASE from '../../shared/env/ENVIRONMENT_IS_USING_TEST_DATABASE';

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
    ENVIRONMENT_IS_USING_TEST_DATABASE &&
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
