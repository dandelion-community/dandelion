import * as React from 'react';
import { Linking } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';

export default function SupportAppCard(): JSX.Element {
  return (
    <StyledCard>
      <Card.Title title="Support this App 💸" />
      <Card.Content>
        <Paragraph>
          A monthly contribution will help keep this app going!
        </Paragraph>
        <Button
          onPress={() =>
            Linking.openURL('https://www.patreon.com/dandelion_community_aid')
          }
        >
          Become a Patron
        </Button>
      </Card.Content>
    </StyledCard>
  );
}
