import * as React from 'react';
import { View } from 'react-native';
import Row from 'src/client/aid_request/detail/components/Row';
import RowTitle from 'src/client/aid_request/detail/components/RowTitle';
import { AidRequestDetailsQuery_aidRequest_status } from 'src/client/aid_request/detail/__generated__/AidRequestDetailsQuery';
import FullWidthButton from 'src/client/components/m3/FullWidthButton';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import AidRequestEditDrawer from 'src/client/request_explorer/AidRequestEditDrawer';

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
      <FullWidthButton
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
