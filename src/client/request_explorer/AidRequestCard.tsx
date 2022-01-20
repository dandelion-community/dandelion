import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import PressableText from 'src/client/components/PressableText';
import Text from 'src/client/components/Text';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import { useThemeColor } from 'src/client/light-or-dark/useThemeColor';
import AidRequestEditDrawer from './AidRequestEditDrawer';
import type { AidRequestCardFragment } from './__generated__/AidRequestCardFragment';

type Props = {
  aidRequest: AidRequestCardFragment;
};

export default function AidRequestCard({ aidRequest }: Props): JSX.Element {
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
        <PressableText
          onPress={() =>
            Linking.openURL(
              `mailto:${aidRequest.whoRecordedIt?.username}?subject=RE: ${whatIsNeeded} for ${whoIsItFor}`,
            )
          }
        >
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
