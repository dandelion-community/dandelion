import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColor } from 'src/client/components/Colors';

export default function Divider(): JSX.Element {
  const backgroundColor = useColor('divider');
  return <View style={[styles.divider, { backgroundColor }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
