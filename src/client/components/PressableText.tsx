import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemeColor } from 'src/client/light-or-dark/useThemeColor';

type Props = {
  children: string;
  onPress?: () => void;
};

export default function PressableText({
  children,
  onPress,
}: Props): JSX.Element {
  const linkColor = useThemeColor(
    { dark: '#a577e7', light: '#6200EE' },
    'text',
  );

  const text = (
    <Text style={[{ color: linkColor }, styles.text]}>{children}</Text>
  );

  return onPress == null ? (
    text
  ) : (
    <Pressable onPress={onPress}>{text}</Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
