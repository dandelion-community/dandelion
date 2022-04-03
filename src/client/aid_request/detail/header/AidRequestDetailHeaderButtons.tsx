import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import AidRequestDetailMoreButton from 'src/client/aid_request/detail/more/AidRequestDetailMoreButton';
import { AidRequestDetailsQuery_aidRequest } from 'src/client/aid_request/detail/__generated__/AidRequestDetailsQuery';
import ShareAidRequestButton from 'src/client/aid_request/share/ShareAidRequestButton';
import { validate } from '../AidRequestDetailsGraphQLType';

type Props = {
  aidRequest: AidRequestDetailsQuery_aidRequest | undefined;
};

export default function AidRequestDetailHeaderButtons({
  aidRequest: aidRequest_,
}: Props): JSX.Element | null {
  const aidRequest = validate(aidRequest_);
  if (aidRequest == null) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <ShareAidRequestButton aidRequest={aidRequest} />
      <View style={styles.smallSpacer} />
      <AidRequestDetailMoreButton aidRequest={aidRequest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 4,
  },
  smallSpacer: {
    flexGrow: 0,
    width: 4,
  },
  spacer: {
    flexGrow: 1,
  },
});
