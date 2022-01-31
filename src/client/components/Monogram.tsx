import * as React from 'react';
import { Text, View } from 'react-native';
import chooseArrayElementFromHashOfString from 'src/shared/utils/chooseArrayElementFromHashOfString';

type Props = {
  name: string;
};

const SIZE = 16;

export default function Monogram({ name }: Props): JSX.Element {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: chooseArrayElementFromHashOfString(
          name,
          MONOGRAM_COLORS,
        ),
        borderRadius: 8,
        flexDirection: 'row',
        height: SIZE,
        width: SIZE,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: SIZE * (10 / 16),
          fontWeight: 'bold',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {name.substring(0, 1)}
      </Text>
    </View>
  );
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
