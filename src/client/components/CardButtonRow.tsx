import Button from 'components/Button';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  buttons: Array<Parameters<typeof Button>[0]>;
};

export default function CardButtonRow({ buttons }: Props): JSX.Element {
  return (
    <View style={styles.row}>
      {buttons.map(({ text, ...props }) => (
        <View key={text} style={styles.button}>
          <Button text={text} {...props} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
    marginHorizontal: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    width: '100%',
  },
});
