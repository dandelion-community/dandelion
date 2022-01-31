import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useColor } from 'src/client/components/Colors';

type Props = {
  children: string;
};

export default function Row({ children }: Props): JSX.Element {
  const color = useColor('text');
  return <Text style={[{ color }, styles.rowTitle]}>{children}</Text>;
}

const styles = StyleSheet.create({
  rowTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
