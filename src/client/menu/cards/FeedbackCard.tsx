import * as React from 'react';
import { Linking } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import createEmailLink from 'src/client/email_link/createEmailLink';

export default function FeedbackCard(): React.ReactElement {
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
              createEmailLink({
                emailUser: 'feedback',
                subject: 'Dandelion Feedback',
              }),
            )
          }
        >
          Send Feedback
        </Button>
      </Card.Content>
    </StyledCard>
  );
}
