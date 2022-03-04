import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useColor } from 'src/client/components/Colors';

type Props = {
  children: string;
  onPress?: () => void;
};

export default function PressableText({
  children,
  onPress,
}: Props): JSX.Element {
  const linkColor = useColor('pressableText');

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
