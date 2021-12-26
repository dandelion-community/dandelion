import * as React from 'react';
import { Pressable } from 'react-native';
import Text from './Text';
import { useThemeColor } from './useThemeColor';

type Props = {
  children: string;
  onPress: () => void;
};

export default function PressableText({
  children,
  onPress,
}: Props): JSX.Element {
  const linkColor = useThemeColor(
    { dark: '#edbfbf', light: '#8a67cf' },
    'text',
  );

  return (
    <Pressable onPress={onPress}>
      <Text style={{ color: linkColor }}>{children}</Text>
    </Pressable>
  );
}
