// Adapted from https://stackoverflow.com/a/65730622/2089738
export default function searchPrefixes(original: string): string {
  return original
    .split(' ')
    .reduce((ngrams: string[], token: string): string[] => {
      for (let i = 1; i <= token.length; i++) {
        ngrams.push(token.substring(0, i));
      }
      return ngrams;
    }, [])
    .join(' ');
}
