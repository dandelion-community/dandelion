import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';

type Props = {
  loading?: boolean;
  subtext: string;
  text: string;
  onPress: () => void;
};

export default function Button({ subtext, text, onPress }: Props) {
  const textColor = useColor('text');
  return (
    <View style={styles.container}>
      <TouchableRipple
        onPress={onPress}
        style={[styles.button, { borderColor: textColor }]}
      >
        <View style={{ paddingVertical: 30 }}>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.subtext}>{subtext}</Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    textAlign: 'center',
  },
  container: {
    marginBottom: 40,
    marginHorizontal: 32,
  },
  subtext: {
    fontSize: 12,
    marginTop: 24,
  },
  text: {
    fontSize: 24,
  },
});
