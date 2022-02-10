export default function getTypedError(e: unknown): Error {
  return e instanceof Error ? e : new Error(JSON.stringify(e));
}
