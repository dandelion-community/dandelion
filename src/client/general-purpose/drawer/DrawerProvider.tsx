import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import useColorScheme from '../components/light-or-dark-themed/useColorScheme';
import DrawerContext from './DrawerContext';

type Props = {
  children: React.ReactChild[];
};

export default function DrawerProvider({
  children,
}: Props): React.ReactElement {
  const [{ renderer }, setRenderer] = React.useState<{
    renderer: undefined | (() => React.ReactElement);
  }>({ renderer: undefined });
  const value = React.useMemo(
    () => ({
      openDrawer: (renderer: () => React.ReactElement) =>
        setRenderer({ renderer }),
    }),
    [],
  );
  const scheme = useColorScheme();

  return (
    <DrawerContext.Provider value={value}>
      {children}
      <BottomSheet
        onBackButtonPress={() => setRenderer({ renderer: undefined })}
        onBackdropPress={() => setRenderer({ renderer: undefined })}
        visible={renderer != null}
      >
        <View
          style={[
            styles.common,
            scheme === 'light' ? styles.light : styles.dark,
          ]}
        >
          {renderer == null ? null : renderer()}
        </View>
      </BottomSheet>
    </DrawerContext.Provider>
  );
}

const styles = StyleSheet.create({
  common: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  dark: {
    backgroundColor: '#333333',
  },
  light: {
    backgroundColor: '#FFFFFF',
  },
});
