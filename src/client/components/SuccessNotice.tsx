import * as React from 'react';
import { StyleSheet } from 'react-native';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';
import { useColor } from './Colors';

type Props = {
  text: string | undefined;
};

export default function SuccessNotice({ text }: Props) {
  if (text == null) {
    return null;
  }
  const backgroundColor = useColor('draftCardColor');
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
});
