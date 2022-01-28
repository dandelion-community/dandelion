import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import TextInput from 'src/client/components/TextInput';

type Props = {
  next: () => void;
  whoIsItFor: string;
  setWhoIsItFor: (name: string) => void;
};

export default function AidRequestCreateDrawer({
  whoIsItFor,
  setWhoIsItFor,
  next,
}: Props): JSX.Element {
  const [inputIsFocused, setInputIsFocused] = React.useState<boolean>(true);
  return (
    <>
      <TextInput
        autoComplete="off"
        autoFocus={true}
        label={!inputIsFocused && whoIsItFor ? 'FOR' : 'Who is it for?'}
        onSubmitEditing={next}
        setFocused={setInputIsFocused}
        setValue={setWhoIsItFor}
        value={whoIsItFor}
      />
      <View style={styles.bottomSpacer} />
    </>
  );
}

const styles = StyleSheet.create({
  bottomSpacer: { height: 8 },
});
