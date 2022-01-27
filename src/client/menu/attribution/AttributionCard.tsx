import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Card, List } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import Icon from 'src/client/components/Icon';
import filterNulls from '../../../shared/utils/filterNulls';
import {
  AttributionCardQuery,
  AttributionCardQuery_attributions,
} from './__generated__/AttributionCardQuery';

export default function AttributionCard(): JSX.Element {
  const { data } = useQuery<AttributionCardQuery>(ATTRIBUTION_CARD_QUERY);
  const attributions = filterNulls(data?.attributions ?? []);
  return (
    <StyledCard>
      <Card.Title title="Icon Attributions" />
      <Card.Content>
        <FlatList
          data={attributions}
          keyExtractor={({ icon }) => icon}
          renderItem={renderItem}
        />
      </Card.Content>
    </StyledCard>
  );

  function renderItem({
    item,
  }: ListRenderItemInfo<AttributionCardQuery_attributions>): React.ReactElement {
    const { icon, text } = item;
    return (
      <List.Item
        description={text}
        left={() => <Icon path={icon} />}
        title={text}
      />
    );
  }
}

export const ATTRIBUTION_CARD_QUERY = gql`
  query AttributionCardQuery {
    attributions {
      icon
      text
    }
  }
`;
