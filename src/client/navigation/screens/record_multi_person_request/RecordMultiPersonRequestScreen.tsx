import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CrewSelector from 'src/client/aid_request/create/CrewSelector';
import FullScreenFormPageWithBigTitle from 'src/client/components/forms/FullScreenFormPageWithBigTitle';
import TextInput from 'src/client/components/TextInput';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';
import RootNavigationStore from '../../root/RootNavigationStore';

export default function RecordAidRequestScreen(): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <RecordMultiPersonRequestScreenImpl />
    </RequireLoggedInScreen>
  );
}

function RecordMultiPersonRequestScreenImpl() {
  const { crews } = useLoggedInViewer();
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string>('');
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const areInputsValid = !!whatIsNeeded.length;

  return (
    <FullScreenFormPageWithBigTitle title="What is needed?">
      <View style={styles.element}>
        <CrewSelector crew={crew} crews={crews} setCrew={setCrew} />
      </View>
      <View style={styles.element}>
        <TextInput
          autoComplete="off"
          autoFocus={true}
          label=""
          mode="flat"
          onSubmitEditing={submit}
          returnKeyType="go"
          setValue={setWhatIsNeeded}
          value={whatIsNeeded}
        />
      </View>
      <View style={styles.element}>
        <View style={styles.buttonRow}>
          <Button disabled={!areInputsValid} mode="contained" onPress={submit}>
            Next
          </Button>
        </View>
      </View>
    </FullScreenFormPageWithBigTitle>
  );

  async function submit(): Promise<void> {
    RootNavigationStore.getValue()?.push('Record Multi Person Request Part 2', {
      crew,
      whatIsNeeded,
    });
  }
}

const styles = StyleSheet.create({
  bottomSpacer: { height: 8 },
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
  element: {
    marginHorizontal: 8,
  },
});
