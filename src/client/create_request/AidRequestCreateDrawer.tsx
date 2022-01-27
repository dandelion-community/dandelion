import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Text from 'src/client/components/Text';
import type {
  CreateAidRequestsMutation,
  CreateAidRequestsMutationVariables,
} from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import DrawerFormTitle from 'src/client/drawer/DrawerFormTitle';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import { AidRequestCardFragments } from 'src/client/request_explorer/AidRequestCardFragments';
import { broadcastAidRequestUpdated } from 'src/client/request_explorer/AidRequestFilterLocalCacheUpdater';
import useToastContext from 'src/client/toast/useToastContext';
import { useLoggedInViewer } from 'src/client/viewer/ViewerContext';
import filterNulls from 'src/shared/utils/filterNulls';
import CrewSelector from './CrewSelector';
import WhatIsNeeded from './WhatIsNeeded';
import WhoIsItFor from './WhoIsItFor';

const APPROX_ROW_HEIGHT = 47;

export default function AidRequestCreateDrawer(): JSX.Element {
  const { publishToast } = useToastContext();
  const { closeDrawer } = useDrawerContext();
  const { crews, id: viewerID } = useLoggedInViewer();
  const scrollView = React.useRef<ScrollView | null | undefined>();
  const [whoIsItFor, setWhoIsItFor] = React.useState<string>('');
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string[]>(['']);
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const areInputsValid =
    whoIsItFor.length > 0 && whatIsNeeded.filter(Boolean).length > 0;
  const [runCreateRequestMutation, createRequestMutationState] = useMutation<
    CreateAidRequestsMutation,
    CreateAidRequestsMutationVariables
  >(CREATE_AID_REQUESTS_MUTATION);
  const { loading, error } = createRequestMutationState;

  return (
    <View>
      <DrawerFormTitle>New Request</DrawerFormTitle>
      <CrewSelector crew={crew} crews={crews} setCrew={setCrew} />
      <WhoIsItFor setWhoIsItFor={setWhoIsItFor} whoIsItFor={whoIsItFor} />
      {whoIsItFor ? (
        <ScrollView
          ref={(ref) => {
            scrollView.current = ref;
          }}
          style={{ maxHeight: APPROX_ROW_HEIGHT * 4 }}
        >
          <WhatIsNeeded
            scrollToEnd={() => scrollView.current?.scrollToEnd()}
            setWhatIsNeeded={setWhatIsNeeded}
            whatIsNeeded={whatIsNeeded}
          />
        </ScrollView>
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
        <Button disabled={loading} mode="text" onPress={closeDrawer}>
          Cancel
        </Button>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
    </View>
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
    closeDrawer();
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
