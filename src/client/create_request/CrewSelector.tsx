import * as React from 'react';
import { Pressable, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Text from 'src/client/components/Text';

type Props = {
  crew: string;
  crews: string[];
  setCrew: (crew: string) => void;
};

export default function CrewSelector({
  crew,
  crews,
  setCrew,
}: Props): JSX.Element {
  return crews.length <= 1 ? (
    <></>
  ) : (
    <RadioButton.Group onValueChange={setCrew} value={crew}>
      {crews.map((crew) => (
        <Pressable key={crew} onPress={() => setCrew(crew)}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <RadioButton value={crew} />
            <Text>{crew}</Text>
          </View>
        </Pressable>
      ))}
    </RadioButton.Group>
  );
}
