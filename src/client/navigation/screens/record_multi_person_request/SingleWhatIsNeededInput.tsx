import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from 'src/client/components/Text';
import TextInput from 'src/client/components/TextInput';

type Props = {
  next: () => void;
  whatIsNeeded: string;
  setWhatIsNeeded: (whatIsNeeded: string) => void;
};

export default function SingleWhatIsNeededInput({
  whatIsNeeded,
  setWhatIsNeeded,
  next,
}: Props): JSX.Element {
  return (
    <>
      <View style={{ marginHorizontal: 32, marginTop: 16 }}>
        <Text style={{ fontSize: 48, fontWeight: '700' }}>What is needed?</Text>
      </View>
      <TextInput
        autoComplete="off"
        autoFocus={true}
        label=""
        mode="flat"
        onSubmitEditing={next}
        setValue={setWhatIsNeeded}
        value={whatIsNeeded}
      />
      <View style={styles.bottomSpacer} />
    </>
  );
}

const styles = StyleSheet.create({
  bottomSpacer: { height: 8 },
});
