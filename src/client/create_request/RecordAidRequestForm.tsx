import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { broadcastManyNewAidRequests } from 'src/client/aid_request/cache/broadcastAidRequestUpdates';
import Text from 'src/client/components/Text';
import useToastContext from 'src/client/toast/useToastContext';
import { useLoggedInViewer } from 'src/client/viewer/ViewerContext';
import createAidRequestSaveToServer from '../aid_request/create/createAidRequestSaveToServer';
import {
  createNewAidRequestDraft,
  SuccessfulSaveData,
} from '../aid_request/drafts/AidRequestDrafts';
import CrewSelector from './CrewSelector';
import WhatIsNeeded from './WhatIsNeeded';
import { TextInputHandles } from './WhatIsNeededRow';
import WhoIsItFor from './WhoIsItFor';

type Props = {
  pop: () => void;
};

export default function RecordAidRequestForm({ pop }: Props): JSX.Element {
  const { publishToast } = useToastContext();
  const whatIsNeededRef = React.useRef<TextInputHandles | null>(null);
  const { crews } = useLoggedInViewer();
  const scrollView = React.useRef<ScrollView | null | undefined>();
  const [whoIsItFor, setWhoIsItFor] = React.useState<string>('');
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string[]>([]);
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const areInputsValid =
    whoIsItFor.length > 0 && whatIsNeeded.filter(Boolean).length > 0;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <ScrollView
      ref={(ref) => {
        scrollView.current = ref;
      }}
      style={{ flex: 1 }}
    >
      <CrewSelector crew={crew} crews={crews} setCrew={setCrew} />
      <WhoIsItFor
        next={focusWhatIsNeeded}
        setWhoIsItFor={setWhoIsItFor}
        whoIsItFor={whoIsItFor}
      />
      {whoIsItFor ? (
        <WhatIsNeeded
          ref={(ref) => {
            whatIsNeededRef.current = ref;
          }}
          scrollToEnd={() => scrollView.current?.scrollToEnd()}
          setWhatIsNeeded={setWhatIsNeeded}
          whatIsNeeded={whatIsNeeded}
        />
      ) : null}
      <View style={styles.buttonRow}>
        <Button
          disabled={!areInputsValid}
          loading={isLoading}
          mode="contained"
          onPress={submit}
        >
          Submit
        </Button>
        <Button disabled={isLoading} mode="text" onPress={pop}>
          Cancel
        </Button>
      </View>
      <Text>{errorMessage}</Text>
    </ScrollView>
  );

  async function submit(): Promise<void> {
    publishToast(undefined);
    setErrorMessage('');
    const variables = {
      crew,
      whatIsNeeded,
      whoIsItFor,
    };
    setWhatIsNeeded([]);
    setIsLoading(true);
    let data: null | SuccessfulSaveData = await createAidRequestSaveToServer(
      variables,
    );
    let isDraft = false;
    if (data == null) {
      isDraft = true;
      data = createNewAidRequestDraft(variables);
    }
    setIsLoading(false);
    if (data == null) {
      setErrorMessage('Unable to save. Please try again later');
      return;
    }
    const { postpublishSummary, aidRequests } = data;
    publishToast({
      message: postpublishSummary,
    });
    if (!isDraft) {
      broadcastManyNewAidRequests(aidRequests);
    }
    pop();
  }

  function focusWhatIsNeeded(): void {
    whatIsNeededRef.current?.focus();
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
});
