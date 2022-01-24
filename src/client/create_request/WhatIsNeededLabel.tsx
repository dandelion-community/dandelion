import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from 'src/client/components/Colors';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

type Props = { show: boolean };

export default function WhatIsNeededLabel({ show }: Props): JSX.Element {
  const scheme = useColorScheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            scheme === 'light'
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: scheme === 'light' ? Colors.light.text : Colors.dark.text,
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
