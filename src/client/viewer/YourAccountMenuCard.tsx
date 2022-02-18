import * as React from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import DebouncedLoadingIndicator from 'src/client/utils/DebouncedLoadingIndicator';
import Loading from 'src/client/utils/loading/Loading';
import LoginOrRegisterActionsRow from 'src/client/viewer/LoginOrRegisterActionsRow';
import LogoutAction from 'src/client/viewer/LogoutAction';
import { useViewer } from 'src/client/viewer/Viewer';

export default function YourAccountMenuCard(): JSX.Element {
  const viewer = useViewer();
  return (
    <StyledCard>
      <Card.Title title="Your Account" />
      {viewer === Loading ? (
        <Card.Content>
          <View style={{ minHeight: 95 }}>
            <DebouncedLoadingIndicator />
          </View>
        </Card.Content>
      ) : viewer === undefined ? (
        <>
          <Card.Content>
            <Paragraph>You are not signed in.</Paragraph>
          </Card.Content>
          <Card.Actions>
            <LoginOrRegisterActionsRow />
          </Card.Actions>
        </>
      ) : (
        <>
          <Card.Content>
            <Paragraph>You are logged in as {viewer.username}.</Paragraph>
          </Card.Content>
          <Card.Actions>
            <LogoutAction />
          </Card.Actions>
        </>
      )}
    </StyledCard>
  );
}
