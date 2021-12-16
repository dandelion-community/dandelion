import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/Button';

type Props = {
  buttons: Array<Parameters<typeof Button>[0]>;
};

export default function CardButtonRow({ buttons }: Props): JSX.Element {
  return (
    <View style={styles.row}>
      {buttons.map(({ text, ...props }) => (
        <View style={styles.button}>
          <Button key={text} text={text} {...props} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
  },
  row: {
    alignItems: 'center',
    columnGap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    width: '100%',
  },
});
