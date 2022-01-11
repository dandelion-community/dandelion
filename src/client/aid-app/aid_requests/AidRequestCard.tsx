import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import { useThemeColor } from '../../general-purpose/components/light-or-dark-themed/useThemeColor';
import AidRequestCompleteToggle from './AidRequestCompleteToggle';
import AidRequestWorkingOnItSummary from './AidRequestWorkingOnItSummary';
import type { AidRequestCardFragment } from './__generated__/AidRequestCardFragment';

type Props = {
  aidRequest: AidRequestCardFragment;
};

export default function AidRequestCard({ aidRequest }: Props): JSX.Element {
  const { whatIsNeeded, whoIsItFor, whoRecordedIt } = aidRequest;
  const backgroundColor = useThemeColor({}, 'cardBackground');
  return (
    <Card elevation={4} style={[styles.card, { backgroundColor }]}>
      <Card.Title title={whatIsNeeded} />
      <Card.Content>
        <Paragraph>
          <Text>
            For <Text style={{ fontWeight: 'bold' }}>{whoIsItFor}</Text>
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>Recorded by {whoRecordedIt?.displayName ?? 'Unknown'}</Text>
        </Paragraph>
        <AidRequestCompleteToggle aidRequest={aidRequest} />
        <AidRequestWorkingOnItSummary aidRequest={aidRequest} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    margin: 10,
  },
});
