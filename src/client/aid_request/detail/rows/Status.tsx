import * as React from 'react';
import Row from '../components/Row';
import RowTitle from '../components/RowTitle';
import { AidRequestDetailsQuery_aidRequest_status } from '../__generated__/AidRequestDetailsQuery';

type Props = {
  status: AidRequestDetailsQuery_aidRequest_status;
};

export default function Status({ status }: Props): JSX.Element {
  const { people, message } = status;
  return (
    <Row
      divider={true}
      header="Status"
      headerMonograms={people.map(({ displayName }) => displayName)}
    >
      <RowTitle>{message}</RowTitle>
    </Row>
  );
}
