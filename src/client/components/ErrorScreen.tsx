import { ApolloError } from '@apollo/client';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Text from 'src/client/components/Text';
import View from 'src/client/components/View';
import useDebugInfo from '../utils/useDebugInfo';

type Props = {
  error: ApolloError;
};

export default function ErrorScreen({ error }: Props) {
  const { errorMessage, debugInfo } = useDebugInfo(error);
  return (
    <View style={styles.container}>
      <Text>{errorMessage}</Text>
      <View style={styles.button}>
        <Button
          mode="contained"
          onPress={() => {
            Linking.openURL(
              `mailto:report.an.error@dandelion.supplies?subject=Dandelion Error&body=%0D%0AError Message: ${errorMessage}%0D%0AReference: ${debugInfo}`,
            );
          }}
        >
          Email us about this
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    margin: 20,
  },
});
