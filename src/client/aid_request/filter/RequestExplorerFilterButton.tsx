import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { FilterSettingType } from 'src/client/aid_request/filter/FilterSettingType';
import RequestExplorerFiltersStore from 'src/client/aid_request/filter/RequestExplorerFiltersStore';
import { useRequestExplorerFilters } from 'src/client/aid_request/filter/useRequestExplorerFilters';
import Text from 'src/client/components/Text';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';

export default function RequestExplorerFilterButton({
  getCurrentToggleState,
  label,
  toggleOff,
  toggleOn,
}: FilterSettingType): React.ReactElement {
  const filter = useRequestExplorerFilters();
  const { id: viewerID } = useLoggedInViewer();
  const context = { viewerID };
  const enabled = getCurrentToggleState(filter, context);
  const theme = useColorScheme();
  const style = [
    styles.container,
    theme === 'light' ? styles.containerLight : styles.containerDark,
    ...(enabled ? [theme === 'light' ? styles.onLight : styles.onDark] : []),
  ];
  return (
    <Pressable onPress={onPress}>
      <View style={style}>
        <Text>{label}</Text>
      </View>
    </Pressable>
  );

  function onPress(): void {
    if (enabled) {
      RequestExplorerFiltersStore.update(toggleOff(filter, context));
    } else {
      RequestExplorerFiltersStore.update(toggleOn(filter, context));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    margin: 2,
    padding: 6,
  },
  containerDark: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  containerLight: {
    backgroundColor: '#bbb',
    borderColor: '#b5b5b5',
  },
  onDark: {
    borderColor: '#bbb',
  },
  onLight: {
    borderColor: '#333',
  },
});
