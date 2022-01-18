import StyledCard from 'components/Card';
import DebouncedLoadingIndicator from 'utils/DebouncedLoadingIndicator';
import Loading from 'utils/loading';
import LoginOrRegisterActionsRow from 'viewer/LoginOrRegisterActionsRow';
import LogoutAction from 'viewer/LogoutAction';
import { useViewerContext } from 'viewer/ViewerContext';
import * as React from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

export default function YourAccountMenuCard(): JSX.Element {
  const { username } = useViewerContext();
  return (
    <StyledCard>
      <Card.Title title="Your Account" />
      {username === Loading ? (
        <Card.Content>
          <View style={{ minHeight: 95 }}>
            <DebouncedLoadingIndicator />
          </View>
        </Card.Content>
      ) : username == null ? (
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
            <Paragraph>You are logged in as {username}.</Paragraph>
          </Card.Content>
          <Card.Actions>
            <LogoutAction />
          </Card.Actions>
        </>
      )}
    </StyledCard>
  );
}
