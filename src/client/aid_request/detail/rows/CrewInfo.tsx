import * as React from 'react';
import CrewStrings from 'src/shared/strings/CrewStrings';
import Row from '../components/Row';
import RowTitle from '../components/RowTitle';

type Props = {
  crew: string;
};

export default function CrewInfo({ crew }: Props): JSX.Element {
  const crewToDisplay = crew ?? 'None';
  return (
    <Row
      divider={true}
      header={CrewStrings.userVisibleTitle}
      headerMonograms={[crewToDisplay]}
    >
      <RowTitle>{crewToDisplay}</RowTitle>
    </Row>
  );
}
