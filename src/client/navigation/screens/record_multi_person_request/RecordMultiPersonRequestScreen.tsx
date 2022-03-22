import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
// import { broadcastManyNewAidRequests } from 'src/client/aid_request/cache/broadcastAidRequestUpdates';
// import createAidRequestSaveToServer from 'src/client/aid_request/create/createAidRequestSaveToServer';
import CrewSelector from 'src/client/aid_request/create/CrewSelector';
import { TextInputHandles } from 'src/client/aid_request/create/WhatIsNeededRow';
// import {
//   createNewAidRequestDraft,
//   SuccessfulSaveData,
// } from 'src/client/aid_request/drafts/AidRequestDrafts';
import Text from 'src/client/components/Text';
import TextInput from 'src/client/components/TextInput';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
// import ToastStore from 'src/client/toast/ToastStore';
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
  const whoIsItForRef = React.useRef<TextInputHandles | null>(null);
  const { crews } = useLoggedInViewer();
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string>('');
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const areInputsValid = whatIsNeeded.length;

  return (
    <View
      style={{
        bottom: 16,
        flexDirection: 'column-reverse',
        marginHorizontal: 8,
        position: 'absolute',
      }}
    >
      <View style={{ marginHorizontal: 16 }}>
        <TextInput
          autoComplete="off"
          autoFocus={true}
          label=""
          mode="flat"
          onSubmitEditing={focusWhoIsItFor}
          setValue={setWhatIsNeeded}
          value={whatIsNeeded}
        />
        <View style={styles.bottomSpacer} />
        <View style={styles.buttonRow}>
          <Button disabled={!areInputsValid} mode="contained" onPress={submit}>
            Next
          </Button>
        </View>
      </View>
      <View style={{ marginBottom: 64, marginHorizontal: 32 }}>
        <Text style={{ fontSize: 48, fontWeight: '700' }}>What is needed?</Text>
      </View>
      <CrewSelector crew={crew} crews={crews} setCrew={setCrew} />
    </View>
  );

  async function submit(): Promise<void> {
    RootNavigationStore.getValue()?.push('Record Multi Person Request Part 2', {
      crew,
      whatIsNeeded,
    });

    // ToastStore.update(undefined);
    // setErrorMessage('');
    // const variables = {
    //   crew,
    //   whatIsNeeded,
    //   whoIsItFor,
    // };
    // setWhatIsNeeded([]);
    // setIsLoading(true);
    // let data: null | SuccessfulSaveData = await createAidRequestSaveToServer(
    //   variables,
    // );
    // let isDraft = false;
    // if (data == null) {
    //   isDraft = true;
    //   data = createNewAidRequestDraft(variables);
    // }
    // setIsLoading(false);
    // if (data == null) {
    //   setErrorMessage('Unable to save. Please try again later');
    //   return;
    // }
    // const { postpublishSummary: message, aidRequests } = data;
    // ToastStore.update({ message });
    // if (!isDraft) {
    //   broadcastManyNewAidRequests(aidRequests);
    // }
    // pop();
  }

  // function pop(): void {
  //   const rootNavigation = RootNavigationStore.getValue();
  //   rootNavigation?.canGoBack()
  //     ? rootNavigation?.goBack()
  //     : rootNavigation?.replace('Main');
  // }

  function focusWhoIsItFor(): void {
    whoIsItForRef.current?.focus();
  }
}

const styles = StyleSheet.create({
  bottomSpacer: { height: 8 },
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
});
