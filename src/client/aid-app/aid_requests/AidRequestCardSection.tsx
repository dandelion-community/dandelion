import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';

type Props = {
  children: React.ReactNode | (React.ReactNode | null)[];
};

export default function AidRequestCardSection({
  children,
}: Props): JSX.Element {
  const scheme = useColorScheme();

  return (
    <View style={scheme === 'light' ? styles.light : styles.dark}>
      {children}
    </View>
  );
}

type RowProps = Props & {
  justifyContent?: ViewStyle['justifyContent'];
};

AidRequestCardSection.Row = function ({
  children,
  justifyContent,
}: RowProps): JSX.Element {
  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: justifyContent ?? 'flex-start',
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#333',
    borderRadius: 5,
    elevation: 7,
    flexDirection: 'column',
    marginTop: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    elevation: 7,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
