import { gql } from '@apollo/client';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph, ProgressBar } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import Text from 'src/client/components/Text';
import LogoutAction from 'src/client/viewer/LogoutAction';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';
import ErrorNotice from '../components/ErrorNotice';
import InlineEditableText from '../components/InlineEditableText';
import resetCache from '../graphql/resetCache';
import useMutateWithToast from '../graphql/useMutateWithToast';
import {
  ChangeNameMutation,
  ChangeNameMutationVariables,
} from './__generated__/ChangeNameMutation';

export default function YourAccountMenuCard(): React.ReactElement {
  const viewer = useLoggedInViewer();
  const { mutate, loading, error } = useMutateWithToast<
    ChangeNameMutation,
    ChangeNameMutationVariables
  >({
    errorMessage: 'Unable to update your name',
    mutation: CHANGE_NAME_MUTATION,
    onSuccess: resetCache,
    successMessage: 'Successfully updated your name',
  });
  return (
    <StyledCard>
      <Card.Title title="Your Account" />
      <ProgressBar indeterminate={true} visible={loading} />
      <Card.Content>
        <Text style={styles.fieldHeader}>Name</Text>
        <InlineEditableText
          save={save}
          style={styles.rowTitle}
          value={viewer.displayName}
        />
        <ErrorNotice
          error={error}
          manualChange={`Change name to ${viewer.displayName}`}
          whenTryingToDoWhat="change your name"
        />
        <Paragraph>
          The email address for your account is {viewer.username}.
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <LogoutAction />
      </Card.Actions>
    </StyledCard>
  );

  async function save(displayName: string): Promise<void> {
    if (displayName) {
      await mutate({ displayName });
    }
  }
}

export const CHANGE_NAME_MUTATION = gql`
  mutation ChangeNameMutation($displayName: String!) {
    payload: changeName(displayName: $displayName) {
      _id
      displayName
    }
  }
`;

const styles = StyleSheet.create({
  fieldHeader: {
    fontSize: 12,
    opacity: 0.6,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
