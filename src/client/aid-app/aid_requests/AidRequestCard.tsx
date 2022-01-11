import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import { useThemeColor } from '../../general-purpose/components/light-or-dark-themed/useThemeColor';
import useDrawerOpener from '../../general-purpose/drawer/useDrawerOpener';
import AidRequestCompleteToggle from './AidRequestCompleteToggle';
import AidRequestWorkingOnItSummary from './AidRequestWorkingOnItSummary';
import type { AidRequestCardFragment } from './__generated__/AidRequestCardFragment';

type Props = {
  aidRequest: AidRequestCardFragment;
};

export default function AidRequestCard({ aidRequest }: Props): JSX.Element {
  const { openDrawer } = useDrawerOpener();
  const { whatIsNeeded, whoIsItFor, whoRecordedIt } = aidRequest;
  const backgroundColor = useThemeColor({}, 'cardBackground');

  const renderEditDrawerContents = (): React.ReactElement => {
    return (
      <View style={{ height: 200, width: 200 }}>
        <Text>
          For <Text style={{ fontWeight: 'bold' }}>{whoIsItFor}</Text>
        </Text>
      </View>
    );
  };

  return (
    <Card elevation={4} style={[styles.card, { backgroundColor }]}>
      <Card.Title
        right={() => (
          <View style={{ padding: 4 }}>
            <Pressable onPress={() => openDrawer(renderEditDrawerContents)}>
              <MaterialCommunityIcons
                color="white"
                name="dots-vertical"
                size={24}
              />
            </Pressable>
          </View>
        )}
        title={whatIsNeeded}
      />
      <Card.Content>
        <Paragraph>
          <Text>
            For <Text style={{ fontWeight: 'bold' }}>{whoIsItFor}</Text>
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>Recorded by {whoRecordedIt?.displayName ?? 'Unknown'}</Text>
        </Paragraph>
        <Paragraph>
          <Text>{aidRequest.latestEvent}</Text>
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
