// From https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export default function hash(str: string): number {
  let hash = 0,
    i: number,
    chr: number;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
