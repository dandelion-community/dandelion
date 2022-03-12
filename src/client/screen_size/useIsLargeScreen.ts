import { useWindowDimensions } from 'react-native';

export default function useIsLargeScreen(): boolean {
  const { width } = useWindowDimensions();
  return width > 504;
}
