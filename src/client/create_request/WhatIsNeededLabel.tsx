import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColor } from 'src/client/components/Colors';

type Props = {
  show: boolean;
};

export default function WhatIsNeededLabel({ show }: Props): JSX.Element {
  const backgroundColor = useColor('background');
  const textColor = useColor('text');
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            opacity: show ? 0.6 : 0,
          },
        ]}
      >
        Request(s)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'baseline',
    elevation: 1,
    paddingHorizontal: 4,
    transform: [{ translateX: 10 }, { translateY: 7 }],
    zIndex: 2,
  },
  text: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
