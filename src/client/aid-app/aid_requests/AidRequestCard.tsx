import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import AidRequestCompleteToggle from './AidRequestCompleteToggle';
import type { AidRequestCardFragment } from './__generated__/AidRequestCardFragment';

type Props = {
  aidRequest: AidRequestCardFragment;
};

export default function AidRequestCard({ aidRequest }: Props): JSX.Element {
  const { whatIsNeeded, whoIsItFor, whoRecordedItUsername } = aidRequest;
  return (
    <Card elevation={4} style={styles.card}>
      <Card.Content>
        <Paragraph style={styles.objectType}>Request</Paragraph>
      </Card.Content>
      <Card.Title title={whatIsNeeded} />
      <Card.Content>
        <Paragraph>
          <Text>For {whoIsItFor}</Text>
        </Paragraph>
        <Paragraph>
          <Text>Recorded by {whoRecordedItUsername}</Text>
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <AidRequestCompleteToggle aidRequest={aidRequest} />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    margin: 10,
  },
  objectType: {
    color: '#8d1616',
  },
});
