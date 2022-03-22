import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import createAidRequestSaveToServer from 'src/client/aid_request/create/createAidRequestSaveToServer';
import { SuccessfulSaveData } from 'src/client/aid_request/drafts/AidRequestDrafts';
import Text from 'src/client/components/Text';
import ToastStore from 'src/client/toast/ToastStore';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import { RootStackScreenProps } from '../../NavigationTypes';
import MultiWhoIsItForInput from './MultiWhoIsItForInput';

export default function RecordMultiPersonRequestScreenPart2(
  props: RootStackScreenProps<'Record Multi Person Request Part 2'>,
): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <RecordMultiPersonRequestScreenPart2Impl {...props} />
    </RequireLoggedInScreen>
  );
}

function RecordMultiPersonRequestScreenPart2Impl(
  props: RootStackScreenProps<'Record Multi Person Request Part 2'>,
) {
  const { crew, whatIsNeeded } = props.route.params;
  crew;
  whatIsNeeded;

  // const whoIsItForRef = React.useRef<TextInputHandles | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [whoIsItFor, setWhoIsItFor] = React.useState<string[]>([]);
  const areInputsValid = whoIsItFor.some(Boolean);

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
        <MultiWhoIsItForInput
          setWhoIsItFor={setWhoIsItFor}
          whoIsItFor={whoIsItFor}
        />
        <View style={styles.bottomSpacer} />
        <View style={styles.buttonRow}>
          <Button
            disabled={!areInputsValid}
            loading={isLoading}
            mode="contained"
            onPress={submit}
          >
            Next
          </Button>
        </View>
      </View>
      <View style={{ marginBottom: 64, marginHorizontal: 32 }}>
        <Text style={{ fontSize: 48, fontWeight: '700' }}>
          Who needs {whatIsNeeded}?
        </Text>
        <Text>{errorMessage}</Text>
      </View>
    </View>
  );

  async function submit(): Promise<void> {
    ToastStore.update(undefined);
    setErrorMessage('');
    const variables = {
      crew,
      whatIsNeeded,
      whoIsItFor,
    };
    setIsLoading(true);
    const data: null | SuccessfulSaveData = await createAidRequestSaveToServer(
      variables,
    );
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

  // function focusWhoIsItFor(): void {
  //   whoIsItForRef.current?.focus();
  // }
}

const styles = StyleSheet.create({
  bottomSpacer: { height: 8 },
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
});
