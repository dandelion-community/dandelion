import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import PressableText from 'src/client/components/PressableText';
import Text from 'src/client/components/Text';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import { useThemeColor } from 'src/client/light-or-dark/useThemeColor';
import { GoToRequestDetailScreen } from '../aid_request/detail/AidRequestDetailScreen';
import { useViewerContext } from '../viewer/ViewerContext';
import AidRequestEditDrawer from './AidRequestEditDrawer';
import type { AidRequestCardFragment } from './__generated__/AidRequestCardFragment';

type Props = {
  aidRequest: AidRequestCardFragment;
  goToRequestDetailScreen: GoToRequestDetailScreen;
};

export default function AidRequestCard({
  aidRequest,
  goToRequestDetailScreen,
}: Props): JSX.Element {
  const { openDrawer } = useDrawerContext();
  const viewer = useViewerContext();
  const { whatIsNeeded, whoIsItFor } = aidRequest;
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const colorScheme = useColorScheme();

  const suffix =
    Array.isArray(viewer.crews) && viewer.crews.length > 1
      ? ` (${aidRequest.crew})`
      : null;

  return (
    <Pressable onPress={() => goToRequestDetailScreen(aidRequest._id)}>
      <View style={[styles.card, { backgroundColor }]}>
        <View
          style={{
            alignSelf: 'stretch',
            flexBasis: '93%',
            flexDirection: 'column',
            flexGrow: 0,
            flexShrink: 1,
          }}
        >
          <Text numberOfLines={2}>{whatIsNeeded}</Text>
          <View style={styles.row}>
            <Text style={{ fontSize: 12 }}>
              for <Text style={{ fontWeight: 'bold' }}>{whoIsItFor}</Text>
              {suffix}
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
        <View style={{ flexBasis: '1%', flexGrow: 1 }}>
          <Pressable onPress={() => openDrawer(renderEditDrawerContents)}>
            <MaterialCommunityIcons
              color={colorScheme === 'light' ? 'black' : 'white'}
              name="dots-vertical"
              size={24}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  function renderEditDrawerContents(): React.ReactElement {
    return (
      <AidRequestEditDrawer
        aidRequest={aidRequest}
        goToRequestDetailScreen={goToRequestDetailScreen}
      />
    );
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
    flexDirection: 'row',
    maxWidth: '100%',
    paddingLeft: 8,
    paddingVertical: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
});
