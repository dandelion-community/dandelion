import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default function ago(date: Date): string {
  return timeAgo.format(date).toString();
}
