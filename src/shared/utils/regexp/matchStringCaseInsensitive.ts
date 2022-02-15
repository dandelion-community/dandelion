import escapeRegExp from 'src/shared/utils/regexp/escapeRegExp';

export default function matchStringCaseInsensitive(val: string): RegExp {
  const escaped = escapeRegExp(val);
  return new RegExp(escaped, 'i');
}
