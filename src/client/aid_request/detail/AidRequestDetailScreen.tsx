import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import View from 'src/client/components/View';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import { AidRequestCardFragments } from 'src/client/request_explorer/AidRequestCardFragments';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
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
  const items = getListItems(data);

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
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});
