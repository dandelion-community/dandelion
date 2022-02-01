import { Share } from 'react-native';

export default async function share(
  message: string,
  url: string,
): Promise<void> {
  await Share.share({ message, url });
}
