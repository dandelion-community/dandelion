import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import PressableText from '../../general-purpose/components/light-or-dark-themed/PressableText';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
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
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={[styles.row, styles.topRow]}>
        <Text>{whatIsNeeded}</Text>
        <View>
          <Pressable onPress={() => openDrawer(renderEditDrawerContents)}>
            <MaterialCommunityIcons
              color={colorScheme === 'light' ? 'black' : 'white'}
              name="dots-vertical"
              size={24}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={{ fontSize: 12 }}>
          for <Text style={{ fontWeight: 'bold' }}>{whoIsItFor}</Text>
        </Text>
      </View>
      <View style={[styles.row, styles.bottomRow]}>
        <PressableText onPress={() => viewRequestHistory(aidRequest._id)}>
          {aidRequest.latestEvent}
        </PressableText>
      </View>
    </View>
  );

  function renderEditDrawerContents(): React.ReactElement {
    return <AidRequestEditDrawer aidRequest={aidRequest} />;
  }
}

const styles = StyleSheet.create({
  bottomRow: {
    height: 26,
    paddingTop: 4,
  },
  card: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    elevation: 8,
    flexDirection: 'column',
    paddingLeft: 8,
    paddingVertical: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  topRow: {
    paddingBottom: 4,
  },
});
