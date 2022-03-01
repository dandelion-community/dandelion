import * as React from 'react';
import Row from 'src/client/aid_request/detail/components/Row';
import RowTitle from 'src/client/aid_request/detail/components/RowTitle';
import { AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest } from 'src/client/aid_request/notification_settings/__generated__/AidRequestNotificationSettingsQuery';
import getAidRequestTitle from 'src/shared/aid_request/getAidRequestTitle';

type Props = {
  aidRequest: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest;
};

export default function ActivityHeader({ aidRequest }: Props): JSX.Element {
  return (
    <Row>
      <RowTitle>
        {`Notification Settings for "${getAidRequestTitle(aidRequest)}"`}
      </RowTitle>
    </Row>
  );
}
