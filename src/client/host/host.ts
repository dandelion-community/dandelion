import Constants from 'expo-constants';
import { Platform } from 'react-native';

const host =
  Platform.OS === 'web'
    ? '/'
    : Constants.manifest?.packagerOpts?.dev === true
    ? Platform.OS === 'android'
      ? 'http://10.0.2.2:3333/'
      : 'http://127.0.0.1:3333/'
    : 'https://graphql.dandelion.supplies/';

export default function getURL(path: string): string {
  return host + path;
}
