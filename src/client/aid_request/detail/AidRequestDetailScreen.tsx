import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import LoadingScreen from 'src/client/components/LoadingScreen';
import View from 'src/client/components/View';
import client from 'src/client/graphql/client';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import { AidRequestCardFragments } from 'src/client/request_explorer/AidRequestCardFragments';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import Status from './rows/Status';
import WhatIsNeeded from './rows/WhatIsNeeded';
import WhoIsItFor from './rows/WhoIsItFor';
import WhoRecordedIt from './rows/WhoRecordedIt';
import {
  AidRequestDetailsQuery,
  AidRequestDetailsQueryVariables,
} from './__generated__/AidRequestDetailsQuery';

export type GoToRequestDetailScreen = (aidRequestID: string) => void;

type Item = {
  render: () => React.ReactElement;
  key: string;
};

export default function AidRequestDetailScreen({
  route,
}: RequestExplorerStackScreenProps<'AidRequestDetail'>): JSX.Element {
  const { id: aidRequestID } = route.params;
  const { data, loading, refetch } = useQuery<
    AidRequestDetailsQuery,
    AidRequestDetailsQueryVariables
  >(AID_REQUEST_DETAILS_QUERY, {
    variables: { aidRequestID },
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts thinks outline: 'none' is invalid but it's not
  const items = getListItems(data);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          onRefresh={refetch}
          refreshing={loading}
          renderItem={renderItem}
        />
      </View>
    </RequireLoggedInScreen>
  );
}

function getListItems(data: AidRequestDetailsQuery | undefined): Array<Item> {
  const aidRequest = data?.aidRequest;
  if (aidRequest == null) {
    return [];
  }
  return [
    {
      key: `${aidRequest._id}:whatIsNeeded`,
      render: () => {
        return <WhatIsNeeded whatIsNeeded={aidRequest.whatIsNeeded} />;
      },
    },
    {
      key: `${aidRequest._id}:whoIsItFor`,
      render: () => {
        return <WhoIsItFor whoIsItFor={aidRequest.whoIsItFor} />;
      },
    },
    {
      key: `${aidRequest._id}:whoRecordedIt`,
      render: () => {
        return (
          <WhoRecordedIt displayName={aidRequest.whoRecordedIt?.displayName} />
        );
      },
    },
    {
      key: `${aidRequest._id}:status`,
      render: () => {
        return <Status aidRequest={aidRequest} status={aidRequest.status} />;
      },
    },
  ];
}

function keyExtractor({ key }: Item): string {
  return key;
}

function renderItem({ item }: ListRenderItemInfo<Item>): React.ReactElement {
  return item.render();
}

const AID_REQUEST_DETAILS_QUERY = gql`
  query AidRequestDetailsQuery($aidRequestID: String!) {
    aidRequest(aidRequestID: $aidRequestID) {
      ...AidRequestCardFragment
      status {
        message
        people {
          displayName
        }
      }
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

export function notifyAidRequestDetailScreenAboutMutation(
  aidRequestID: string,
): void {
  const id = `AidRequest:${aidRequestID}`;
  // Invalidate all fields that are requested in AID_REQUEST_DETAILS_QUERY
  // but *not* in AidRequestCardFragment, since the latter will be locally
  // updated after a mutation but the former will not.
  client.cache.evict({
    broadcast: true,
    fieldName: 'status',
    id,
  });
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});
