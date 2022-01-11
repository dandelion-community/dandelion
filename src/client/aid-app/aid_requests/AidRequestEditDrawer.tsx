import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
import filterNulls from '../../../shared/utils/filterNulls';
import type {
  AidRequestEditDrawerFragment,
  AidRequestEditDrawerFragment_actionsAvailable,
} from './__generated__/AidRequestEditDrawerFragment';

type Props = {
  aidRequest: AidRequestEditDrawerFragment;
};

export default function AidRequestEditDrawer({
  aidRequest,
}: Props): JSX.Element {
  const { actionsAvailable } = aidRequest;
  const actions = filterNulls(actionsAvailable ?? []);

  return (
    <FlatList
      data={actions}
      keyExtractor={({ message }) => message}
      renderItem={renderItem}
    />
  );

  function renderItem({
    item: action,
  }: ListRenderItemInfo<AidRequestEditDrawerFragment_actionsAvailable>): React.ReactElement {
    return <List.Item title={action.message} />;
  }
}
