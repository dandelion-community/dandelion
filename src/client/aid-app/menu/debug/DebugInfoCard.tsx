import * as React from 'react';
import { Card } from 'react-native-paper';
import StyledCard from '../../../general-purpose/components/Card';
import PressableText from '../../../general-purpose/components/light-or-dark-themed/PressableText';
import DebugInfo from './DebugInfo';

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
