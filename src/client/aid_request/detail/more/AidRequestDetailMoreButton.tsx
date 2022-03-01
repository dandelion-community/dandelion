import * as React from 'react';
import AidRequestDetailMoreMenu from 'src/client/aid_request/detail/more/AidRequestDetailMoreMenu';
import { AidRequestDetailsQuery_aidRequest } from 'src/client/aid_request/detail/__generated__/AidRequestDetailsQuery';
import DrawerButton from 'src/client/components/DrawerButton';

type Props = {
  aidRequest: AidRequestDetailsQuery_aidRequest;
};

export default function ShareAidRequestButton({
  aidRequest,
}: Props): JSX.Element | null {
  return (
    <DrawerButton iconSize={32} renderDrawerContents={renderDrawerContents} />
  );

  function renderDrawerContents(): React.ReactElement {
    return <AidRequestDetailMoreMenu aidRequest={aidRequest} />;
  }
}
