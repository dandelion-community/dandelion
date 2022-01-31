import * as React from 'react';
import Row from '../components/Row';
import RowTitle from '../components/RowTitle';

type Props = {
  whoIsItFor: string;
};

export default function WhatIsNeeded({ whoIsItFor }: Props): JSX.Element {
  return (
    <Row divider={true} header="For" headerMonograms={[whoIsItFor]}>
      <RowTitle>{whoIsItFor}</RowTitle>
    </Row>
  );
}
