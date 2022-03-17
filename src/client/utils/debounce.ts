export default function debounce<T>(
  fn: (t: T) => void,
  delayMS = 1000,
): (t: T) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (t: T): void => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => fn(t), delayMS);
  };
}
