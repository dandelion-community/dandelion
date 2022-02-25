import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import Colors from 'src/client/components/Colors';
import DrawerContext from 'src/client/drawer/DrawerContext';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import { ChildrenPropsType } from 'src/client/utils/ChildrenPropsType';

export default function DrawerProvider({
  children,
}: ChildrenPropsType): React.ReactElement {
  const [{ renderer }, setRenderer] = React.useState<{
    renderer: undefined | (() => React.ReactElement);
  }>({ renderer: undefined });
  const value = React.useMemo(
    () => ({
      closeDrawer: () => {
        setRenderer({ renderer: undefined });
      },
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
    backgroundColor: Colors.dark.background,
  },
  light: {
    backgroundColor: Colors.light.background,
  },
});
