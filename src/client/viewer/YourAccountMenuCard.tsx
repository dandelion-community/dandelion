import * as React from 'react';
import { Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import LogoutAction from 'src/client/viewer/LogoutAction';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';

export default function YourAccountMenuCard(): React.ReactElement {
  const viewer = useLoggedInViewer();
  return (
    <StyledCard>
      <Card.Title title="Your Account" />
      <Card.Content>
        <Paragraph>
          You are logged in as {viewer.displayName}. The email address for your
          account is {viewer.username}.
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <LogoutAction />
      </Card.Actions>
    </StyledCard>
  );
}
