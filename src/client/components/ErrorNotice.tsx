import { ApolloError } from '@apollo/client';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';
import createEmailLink from '../email_link/createEmailLink';
import useDebugInfo from '../utils/useDebugInfo';
import { useColor } from './Colors';

type Props = {
  error: ApolloError | undefined;
  manualChange?: string;
  whenTryingToDoWhat: string;
};

export default function ErrorNotice({
  error,
  whenTryingToDoWhat,
  manualChange,
}: Props) {
  if (error == null) {
    return null;
  }
  const buttonBackgroundColor = useColor('m3buttonBackground');
  const containerBorderColor = useColor({
    dark: '#542820',
    light: '#ffb5b5',
  });
  const containerBackgroundColor = useColor({
    dark: 'rgba(100, 50, 50, 0.3)',
    light: 'rgba(255, 200, 200, 0.3',
  });
  const { errorMessage, debugInfo } = useDebugInfo(error);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBackgroundColor,
          borderColor: containerBorderColor,
        },
      ]}
    >
      <Text>Something went wrong when trying to {whenTryingToDoWhat}.</Text>
      <Text style={{ marginTop: 10 }}>
        The error message is: {errorMessage}
      </Text>
      <TouchableRipple
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
        style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
      >
        <Text>
          {`Please press here to send us a pre-written email so we can look into it${
            manualChange ? ' and also make this change for you manually' : ''
          }.`}
        </Text>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    borderRadius: 30,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonWrapper: {
    marginTop: 10,
  },
  container: {
    alignItems: 'flex-start',
    borderRadius: 20,
    borderWidth: 4,
    flex: 1,
    justifyContent: 'flex-start',
    margin: 10,
    padding: 10,
  },
});
