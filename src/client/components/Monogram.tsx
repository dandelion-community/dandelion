import emojiRegexConstructor from 'emoji-regex';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import chooseArrayElementFromHashOfString from 'src/shared/utils/chooseArrayElementFromHashOfString';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ts thinks outline: 'none' is invalid but it's not
import unicodeSubstring from 'unicode-substring';

const emojiRegex = emojiRegexConstructor();

type Props = {
  name: string;
};

const DIAMETER = 16;
const INTER_MONOGRAM_SPACING = 4;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: DIAMETER / 2,
    flexDirection: 'row',
    height: DIAMETER,
    marginRight: INTER_MONOGRAM_SPACING,
    width: DIAMETER,
  },
  lowOpacityBackgroundCircle: {
    opacity: 0.3,
  },
  text: {
    color: 'white',
    fontSize: DIAMETER * (10 / 16),
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  textWrapperForLowOpacityBackgroundCircle: {
    alignItems: 'center',
    flexDirection: 'row',
    height: DIAMETER,
    transform: [{ translateX: -DIAMETER - INTER_MONOGRAM_SPACING }],
    width: DIAMETER,
  },
});

export default function Monogram({ name }: Props): JSX.Element {
  const firstCharacter = unicodeSubstring(name, 0, 1);
  const isEmoji = emojiRegex.test(firstCharacter);
  const backgroundColor = chooseArrayElementFromHashOfString(
    name,
    MONOGRAM_COLORS,
  );

  const text = <Text style={styles.text}>{firstCharacter}</Text>;
  if (isEmoji) {
    // Since emojis are already colorful, modify the background color
    // to have 30% opacity
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.container,
            styles.lowOpacityBackgroundCircle,
            { backgroundColor },
          ]}
        ></View>
        <View style={styles.textWrapperForLowOpacityBackgroundCircle}>
          {text}
        </View>
      </View>
    );
  }
  return <View style={[styles.container, { backgroundColor }]}>{text}</View>;
}

const MONOGRAM_COLORS: Array<string> = [
  '#E4C398',
  '#B2CECC',
  '#A8D1B1',
  '#DBB2FF',
  '#A397C5',
  '#DDD486',
  '#EAB4B7',
  '#CCEAB4',
  '#B4EAE7',
  '#9FA7D2',
  '#C88C88',
  '#AD72C1',
  '#C17298',
  '#72C192',
  '#72B3C1',
  '#AFB9BB',
  '#948993',
  '#CAD38D',
  '#A38870',
];
