import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CrewSelector from 'src/client/aid_request/create/CrewSelector';
import FullScreenFormPageWithBigTitle from 'src/client/components/forms/FullScreenFormPageWithBigTitle';
import TextInput from 'src/client/components/TextInput';
import RootNavigationStore from 'src/client/navigation/root/RootNavigationStore';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';

export default function RecordAidRequestScreen(): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <RecordAidRequestScreenImpl />
    </RequireLoggedInScreen>
  );
}

function RecordAidRequestScreenImpl() {
  const { crews } = useLoggedInViewer();
  const [whoIsItFor, setWhoIsItFor] = React.useState<string>('');
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const areInputsValid = !!whoIsItFor.length;

  return (
    <FullScreenFormPageWithBigTitle title="Who is it for?">
      <CrewSelector crew={crew} crews={crews} setCrew={setCrew} />
      <View style={{ marginHorizontal: 16 }}>
        <TextInput
          autoComplete="off"
          autoFocus={true}
          label=""
          mode="flat"
          onSubmitEditing={submit}
          returnKeyType="go"
          setValue={setWhoIsItFor}
          value={whoIsItFor}
        />
        <View style={styles.buttonRow}>
          <Button disabled={!areInputsValid} mode="contained" onPress={submit}>
            Next
          </Button>
        </View>
      </View>
    </FullScreenFormPageWithBigTitle>
  );

  async function submit(): Promise<void> {
    RootNavigationStore.getValue()?.push(
      'Record Single Person Request Part 2',
      {
        crew,
        whoIsItFor,
      },
    );
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
});
