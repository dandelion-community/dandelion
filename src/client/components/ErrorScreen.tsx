import { ApolloError } from '@apollo/client';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';
import createEmailLink from '../email_link/createEmailLink';
import useDebugInfo from '../utils/errors/useMaybeMinifiedErrorReport';

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
              createEmailLink({
                body: [
                  `Error Message: ${errorMessage}`,
                  `Reference: ${debugInfo}`,
                ],
                emailUser: 'report.an.error',
                subject: 'Dandelion Error',
              }),
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
