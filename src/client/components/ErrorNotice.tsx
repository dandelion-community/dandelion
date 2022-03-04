import { ApolloError } from '@apollo/client';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';
import createEmailLink from '../email_link/createEmailLink';
import useDebugInfo from '../utils/useDebugInfo';
import { useColor } from './Colors';

type Props = {
  error: ApolloError;
  manualChange?: string;
  whenTryingToDoWhat: string;
};

export default function ErrorScreen({
  error,
  whenTryingToDoWhat,
  manualChange,
}: Props) {
  const buttonBackgroundColor = useColor('errorButtonBackground');
  const { errorMessage, debugInfo } = useDebugInfo(error);
  return (
    <View style={styles.container}>
      <Text>
        Whoops! There was an error when trying to {whenTryingToDoWhat}.
      </Text>
      <Text style={{ marginTop: 10 }}>
        The error message is: {errorMessage}
      </Text>
      <View style={[styles.button, { backgroundColor: buttonBackgroundColor }]}>
        <Text
          onPress={() => {
            Linking.openURL(
              createEmailLink({
                body: [
                  `${
                    manualChange
                      ? `Please make the following manual change: ${manualChange}`
                      : ''
                  }`,
                  `Error Message: ${errorMessage}`,
                  `Reference: ${debugInfo}`,
                ],
                emailUser: 'report.an.error',
                subject: `Dandelion Error${
                  manualChange ? ' and Manual Change Request' : ''
                }`,
              }),
            );
          }}
        >
          {`Please tap here to send a pre-written email so we can fix this ${
            manualChange ? 'and also make this change for you manually' : ''
          }`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    margin: 20,
  },
});
