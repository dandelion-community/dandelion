import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Text from 'src/client/components/Text';
import type {
  CreateAidRequestsMutation,
  CreateAidRequestsMutationVariables,
} from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import { AidRequestCardFragments } from 'src/client/aid_request/fragments/AidRequestCardFragments';
import { broadcastAidRequestUpdated } from 'src/client/request_explorer/AidRequestFilterLocalCacheUpdater';
import useToastContext from 'src/client/toast/useToastContext';
import { useLoggedInViewer } from 'src/client/viewer/ViewerContext';
import filterNulls from 'src/shared/utils/filterNulls';
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
  const { crews, id: viewerID } = useLoggedInViewer();
  const scrollView = React.useRef<ScrollView | null | undefined>();
  const [whoIsItFor, setWhoIsItFor] = React.useState<string>('');
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string[]>([]);
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const areInputsValid =
    whoIsItFor.length > 0 && whatIsNeeded.filter(Boolean).length > 0;
  const [runCreateRequestMutation, createRequestMutationState] = useMutation<
    CreateAidRequestsMutation,
    CreateAidRequestsMutationVariables
  >(CREATE_AID_REQUESTS_MUTATION);
  const { loading, error } = createRequestMutationState;

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
          loading={loading}
          mode="contained"
          onPress={submit}
        >
          Submit
        </Button>
        <Button disabled={loading} mode="text" onPress={pop}>
          Cancel
        </Button>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
    </ScrollView>
  );

  async function submit(): Promise<void> {
    publishToast(undefined);
    const variables = {
      crew,
      whatIsNeeded,
      whoIsItFor,
    };
    setWhatIsNeeded([]);
    const { data } = await runCreateRequestMutation({
      variables,
    });
    const aidRequests = data?.createAidRequests?.requests;
    const postpublishSummary = data?.createAidRequests?.postpublishSummary;
    if (aidRequests == null || postpublishSummary == null) {
      console.error('Failed to create aidRequest');
      return;
    }
    publishToast({
      message: postpublishSummary,
    });
    filterNulls(aidRequests).forEach((aidRequest) => {
      broadcastAidRequestUpdated(aidRequest._id, aidRequest, { viewerID });
    });
    pop();
  }

  function focusWhatIsNeeded(): void {
    whatIsNeededRef.current?.focus();
  }
}

const CREATE_AID_REQUESTS_MUTATION = gql`
  mutation CreateAidRequestsMutation(
    $crew: String!
    $whatIsNeeded: [String!]!
    $whoIsItFor: String!
  ) {
    createAidRequests(
      crew: $crew
      whatIsNeeded: $whatIsNeeded
      whoIsItFor: $whoIsItFor
    ) {
      postpublishSummary
      requests {
        ...AidRequestCardFragment
      }
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
});
