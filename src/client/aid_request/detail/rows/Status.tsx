import * as React from 'react';
import { View } from 'react-native';
import Row from 'src/client/aid_request/detail/components/Row';
import RowTitle from 'src/client/aid_request/detail/components/RowTitle';
import { AidRequestDetailsQuery_aidRequest_status } from 'src/client/aid_request/detail/__generated__/AidRequestDetailsQuery';
import AidRequestEditDrawer from 'src/client/aid_request/edit/AidRequestEditDrawer';
import Button from 'src/client/components/Button';
import useDrawerContext from 'src/client/drawer/useDrawerContext';

type Props = {
  aidRequest: Parameters<typeof AidRequestEditDrawer>[0]['aidRequest'];
  status: AidRequestDetailsQuery_aidRequest_status;
};

export default function Status({ aidRequest, status }: Props): JSX.Element {
  const { openDrawer } = useDrawerContext();
  const { people, message } = status;
  return (
    <Row
      divider={true}
      header="Status"
      headerMonograms={people.map(({ displayName }) => displayName)}
    >
      <RowTitle>{message}</RowTitle>
      <View style={{ height: 8 }} />
      <Button
        onPress={() => {
          openDrawer(renderEditDrawerContents);
        }}
        text="Update Status"
      />
    </Row>
  );

  function renderEditDrawerContents(): React.ReactElement {
    return <AidRequestEditDrawer aidRequest={aidRequest} />;
  }
}
