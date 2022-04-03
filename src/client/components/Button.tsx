import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';

type Props = {
  loading?: boolean;
  text: string;
  onPress: () => void;
};

export default function FullWidthButton({ text, onPress }: Props): JSX.Element {
  const backgroundColor = useColor('m3buttonBackground');
  const color = useColor('m3buttonText');
  return (
    <TouchableRipple
      onPress={onPress}
      style={[styles.container, { backgroundColor }]}
    >
      <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    marginVertical: 0,
    padding: 10,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
