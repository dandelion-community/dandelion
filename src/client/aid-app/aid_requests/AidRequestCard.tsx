import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import PressableText from '../../general-purpose/components/light-or-dark-themed/PressableText';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import { useThemeColor } from '../../general-purpose/components/light-or-dark-themed/useThemeColor';
import useDrawerContext from '../../general-purpose/drawer/useDrawerContext';
import AidRequestEditDrawer from './AidRequestEditDrawer';
import type { AidRequestCardFragment } from './__generated__/AidRequestCardFragment';

type Props = {
  aidRequest: AidRequestCardFragment;
  viewRequestHistory: (requestID: string) => void;
};

export default function AidRequestCard({
  aidRequest,
  viewRequestHistory,
}: Props): JSX.Element {
  const { openDrawer } = useDrawerContext();
  const { whatIsNeeded, whoIsItFor } = aidRequest;
  const backgroundColor = useThemeColor({}, 'cardBackground');

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
            For <Text style={{ fontWeight: 'bold' }}>{whoIsItFor}!</Text>
          </Text>
        </Paragraph>
        <Paragraph>
          <PressableText onPress={() => viewRequestHistory(aidRequest._id)}>
            {aidRequest.latestEvent}
          </PressableText>
        </Paragraph>
      </Card.Content>
    </Card>
  );

  function renderEditDrawerContents(): React.ReactElement {
    return <AidRequestEditDrawer aidRequest={aidRequest} />;
  }
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    margin: 10,
  },
});
