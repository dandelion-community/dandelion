import StyledCard from 'components/Card';
import PressableText from 'components/PressableText';
import DebugInfo from 'menu/debug/DebugInfo';
import * as React from 'react';
import { Card } from 'react-native-paper';

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
