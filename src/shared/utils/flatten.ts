export default function flatten<T>(array: Array<Array<T>>): Array<T> {
  const flattened: Array<T> = [];
  for (const elem of array) {
    for (const subElem of elem) {
      flattened.push(subElem);
    }
  }
  return flattened;
}
