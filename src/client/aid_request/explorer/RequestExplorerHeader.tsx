import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';
import useViewWidth from 'src/client/components/useViewWidth';
import GlobalSearchStringStore from 'src/client/global_search_string/GlobalSearchStringStore';
import useStore from 'src/client/store/useStore';

export default function RequestExplorerHeader(): JSX.Element {
  const viewWidth = useViewWidth();
  const headerBackgroundColor = useColor('background');
  const searchString = useStore(GlobalSearchStringStore);
  const [val, setVal] = React.useState<string>(searchString);
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      GlobalSearchStringStore.update(val);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [val]);

  return (
    <Appbar.Header
      style={{
        backgroundColor: headerBackgroundColor,
        elevation: 0,
        justifyContent: 'center',
      }}
    >
      <View style={{ width: viewWidth }}>
        <Searchbar
          autoComplete="off"
          autoFocus={false}
          onChangeText={setVal}
          placeholder="Search (who or what)"
          style={[styles.searchbar]}
          value={val}
        />
      </View>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: 'transparent',
    elevation: 2,
  },
});
