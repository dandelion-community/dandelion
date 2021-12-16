import * as React from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import DebouncedLoadingIndicator from '../../general-purpose/utils/DebouncedLoadingIndicator';
import Loading from '../../general-purpose/utils/loading';
import StyledCard from '../components/Card';
import LoginOrRegisterActionsRow from './LoginOrRegisterActionsRow';
import LogoutAction from './LogoutAction';
import { useViewerContext } from './ViewerContext';

export default function YourAccountMenuCard(): JSX.Element {
  const { username } = useViewerContext();
  return (
    <StyledCard>
      <Card.Title title="Your Account" />
      {username === Loading ? (
        <Card.Content>
          <View style={{ minHeight: 71 }}>
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
