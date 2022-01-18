import { useThemeColor } from 'light-or-dark/useThemeColor';
import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  children: string;
  onPress: () => void;
};

export default function PressableText({
  children,
  onPress,
}: Props): JSX.Element {
  const linkColor = useThemeColor(
    { dark: '#a577e7', light: '#6200EE' },
    'text',
  );

  return (
    <Pressable onPress={onPress}>
      <Text style={[{ color: linkColor }, styles.text]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
