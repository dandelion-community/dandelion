import * as React from 'react';
import Icon from 'src/client/components/Icon';
import canUseOperatingSystemShareAPI from 'src/client/utils/sharing/canUseOperatingSystemShareAPI';
import share from 'src/client/utils/sharing/share';
import getAidRequestTitle from 'src/shared/aid_request/getAidRequestTitle';
import aidRequestDetailUrl from 'src/shared/urls/aidRequestDetailUrl';
import { AidRequestGraphQLType } from '../fragments/AidRequestGraphQLType';

type Props = {
  aidRequest: AidRequestGraphQLType;
};

export default function ShareAidRequestButton({
  aidRequest,
}: Props): JSX.Element | null {
  if (!canUseOperatingSystemShareAPI()) {
    return null;
  }
  return (
    <Icon
      onPress={async () => {
        if (aidRequest != null) {
          await share(
            getAidRequestTitle(aidRequest),
            aidRequestDetailUrl(aidRequest._id),
          );
        }
      }}
      path="share"
      size={24}
    />
  );
}
