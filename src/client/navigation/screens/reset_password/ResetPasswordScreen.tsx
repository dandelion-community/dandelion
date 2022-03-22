import { gql, useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import ErrorNotice from 'src/client/components/ErrorNotice';
import TextInput, { TextInputHandles } from 'src/client/components/TextInput';
import View from 'src/client/components/ViewWithBackground';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import useHandleViewer from 'src/client/viewer/useHandleViewer';
import PasswordResetLinkDetails from './PasswordResetLinkDetails';
import {
  ResetPasswordLinkDetailsQuery,
  ResetPasswordLinkDetailsQueryVariables,
} from './__generated__/ResetPasswordLinkDetailsQuery';
import {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from './__generated__/ResetPasswordMutation';

export default function ResetPasswordScreen(
  props: RootStackScreenProps<'ResetPassword'>,
) {
  const { navigation } = props;
  const { token } = props.route.params;
  const {
    data,
    loading: detailsLoading,
    error: detailsError,
  } = useQuery<
    ResetPasswordLinkDetailsQuery,
    ResetPasswordLinkDetailsQueryVariables
  >(RESET_PASSWORD_LINK_DETAILS_QUERY, {
    variables: { token },
  });
  const username = data?.resetPasswordLinkDetails?.username;
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [runResetPasswordMutation, resetPasswordMutationState] = useMutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >(RESET_PASSWORD_MUTATION);
  const { loading: resetLoading, error: resetError } =
    resetPasswordMutationState;
  useHandleViewer(navigation, 'Create Account', {
    loggedIn: async (_, goToMain) => {
      goToMain();
    },
  });

  const passwordRef = React.useRef<TextInputHandles | null>(null);
  const confirmPasswordRef = React.useRef<TextInputHandles | null>(null);

  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = password === confirmPassword;
  const areInputsValid = isPasswordValid && isConfirmPasswordValid;
  const hints = `${
    isPasswordValid ? '' : 'Please use a password of at least 8 characters.'
  } ${isConfirmPasswordValid ? '' : 'Passwords do not match.'}`;

  return (
    <ScrollableScreen
      configs={[
        singleElement({
          key: 'link-details',
          render: () => (
            <View style={styles.element}>
              <PasswordResetLinkDetails
                details={data?.resetPasswordLinkDetails}
                error={detailsError}
                loading={detailsLoading}
              />
            </View>
          ),
        }),
        singleElement({
          key: 'password',
          render: () => (
            <View style={styles.element}>
              <TextInput
                autoComplete="password"
                autoFocus={true}
                label="Password"
                onSubmitEditing={() => {
                  confirmPasswordRef.current?.focus();
                }}
                ref={(ref) => {
                  passwordRef.current = ref;
                }}
                returnKeyType="next"
                setValue={(value: string) =>
                  !resetLoading && setPassword(value)
                }
                value={password}
              />
            </View>
          ),
        }),
        singleElement({
          key: 'confirmPassword',
          render: () => (
            <View style={styles.element}>
              <TextInput
                autoComplete="password"
                autoFocus={false}
                label="Confirm Password"
                onSubmitEditing={() => {
                  if (areInputsValid) {
                    saveNewPassword();
                  }
                }}
                ref={(ref) => {
                  confirmPasswordRef.current = ref;
                }}
                returnKeyType="go"
                setValue={(value: string) =>
                  !resetLoading && setConfirmPassword(value)
                }
                value={confirmPassword}
              />
            </View>
          ),
        }),
        singleElement({
          key: 'save-new-password-button',
          render: () => (
            <View style={[styles.element, styles.button]}>
              <Button
                disabled={!areInputsValid}
                loading={resetLoading}
                mode="contained"
                onPress={saveNewPassword}
              >
                Save New Password
              </Button>
              <Paragraph>{hints}</Paragraph>
            </View>
          ),
        }),
        singleElement({
          key: 'reset-error',
          render: () => (
            <View style={styles.element}>
              <ErrorNotice
                error={resetError}
                manualChange={
                  'create a password reset link' +
                  (username ? ' for ' + username : '')
                }
                whenTryingToDoWhat="send you a password reset email"
              />
            </View>
          ),
        }),
      ]}
    />
  );

  async function saveNewPassword(): Promise<void> {
    const { data } = await runResetPasswordMutation({
      variables: { password, token },
    });
    const message = data?.resetPassword;
    if (message != null) {
      navigation.push('Login', {
        email: username ?? '',
        message,
      });
    }
  }
}

const RESET_PASSWORD_LINK_DETAILS_QUERY = gql`
  query ResetPasswordLinkDetailsQuery($token: String!) {
    resetPasswordLinkDetails(token: $token) {
      username
      expiration_time
      is_valid
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`;

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
  },
  container: {
    marginHorizontal: 20,
  },
  element: {
    marginHorizontal: 8,
  },
});
