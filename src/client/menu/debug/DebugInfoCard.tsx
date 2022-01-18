import * as React from 'react';
import { Card } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import PressableText from 'src/client/components/PressableText';
import DebugInfo from 'src/client/menu/debug/DebugInfo';

export default function DebugInfoCard(): JSX.Element {
  const [shown, setShown] = React.useState<boolean>(false);
  return (
    <StyledCard>
      <Card.Title title="Debug" />
      <Card.Content>
        {shown ? (
          <DebugInfo />
        ) : (
          <PressableText onPress={() => setShown(true)}>Show</PressableText>
        )}
      </Card.Content>
    </StyledCard>
  );
}
