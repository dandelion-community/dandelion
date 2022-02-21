export default function uniques<T>(arr: Array<T>): Array<T> {
  const set = new Set(arr);
  return Array.from(set);
}
