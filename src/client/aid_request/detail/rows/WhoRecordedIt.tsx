import * as React from 'react';
import Row from '../components/Row';
import RowTitle from '../components/RowTitle';

type Props = {
  displayName: string | undefined;
};

export default function WhoRecordedIt({ displayName }: Props): JSX.Element {
  return (
    <Row
      divider={true}
      header="Recorded by"
      headerMonograms={[displayName ?? 'Unknown']}
    >
      <RowTitle>{displayName ?? 'Unknown'}</RowTitle>
    </Row>
  );
}
