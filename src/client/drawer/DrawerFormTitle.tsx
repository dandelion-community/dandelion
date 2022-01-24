import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

type Props = {
  children: string;
};

export default function DrawerFormTitle({
  children: text,
}: Props): React.ReactElement {
  const scheme = useColorScheme();
  return (
    <>
      <Text
        style={[styles.text, scheme === 'light' ? styles.light : styles.dark]}
      >
        {text}
      </Text>
      <View style={styles.bottomSpacer} />
    </>
  );
}

const styles = StyleSheet.create({
  bottomSpacer: { height: 8 },
  dark: { color: '#fff' },
  light: { color: '#000' },
  text: { fontSize: 20, lineHeight: 24 },
});
