import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  View,
  StyleSheet,
} from 'react-native';
import { Card, List } from 'react-native-paper';
import filterNulls from '../../../../shared/utils/filterNulls';
import StyledCard from '../../../general-purpose/components/Card';
import useColorScheme from '../../../general-purpose/components/light-or-dark-themed/useColorScheme';
import {
  AttributionCardQuery,
  AttributionCardQuery_attributions,
} from './__generated__/AttributionCardQuery';

export default function AttributionCard(): JSX.Element {
  const scheme = useColorScheme();
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
        left={() => (
          <View style={styles.icon}>
            <Image
              source={{ uri: `/icons/${scheme}/${icon}.png` }}
              style={styles.icon}
            />
          </View>
        )}
        title={text}
        description={text}
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

const styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
  },
});
