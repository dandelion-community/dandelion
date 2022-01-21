import * as React from 'react';
import { Linking } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';

export default function FeedbackCard(): JSX.Element {
  return (
    <StyledCard>
      <Card.Title title="Got Feedback? 🗣️" />
      <Card.Content>
        <Paragraph>
          We'd love to hear any feedback you have about Dandelion!
        </Paragraph>
        <Button
          onPress={() =>
            Linking.openURL(
              'mailto:lowell.organizing@gmail.com?subject=Dandy Feedback',
            )
          }
        >
          Send Feedback
        </Button>
      </Card.Content>
    </StyledCard>
  );
}
