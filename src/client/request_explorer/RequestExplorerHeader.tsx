import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import useSearchContext from '../context/search/useSearchContext';

export default function RequestExplorerHeader(): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  const { searchString, setSearchString } = useSearchContext();
  const [val, setVal] = React.useState<string>(searchString);
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchString(val);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [val]);

  return (
    <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
      <Searchbar
        autoComplete="off"
        autoFocus={false}
        onChangeText={setVal}
        placeholder="Search (who or what)"
        style={styles.searchbar}
        value={val}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
