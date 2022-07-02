import setTimeoutSafe from './setTimeoutSafe';

export default async function sleep({ ms }: { ms: number }): Promise<void> {
  return await new Promise((resolve) =>
    setTimeoutSafe('sleep:resolve', resolve, ms),
  );
}
