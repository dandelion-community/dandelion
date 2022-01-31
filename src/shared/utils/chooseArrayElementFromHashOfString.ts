import nonCryptoNumericHash from './nonCryptoNumericHash';

export default function chooseArrayElementFromHashOfString<T>(
  str: string,
  arr: Array<T>,
): T {
  const hash = nonCryptoNumericHash(str);
  const index = Math.abs(hash) % arr.length;
  return arr[index];
}
