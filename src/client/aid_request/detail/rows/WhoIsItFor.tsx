import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import useEditAidRequestWithUndo from 'src/client/aid_request/edit/useEditAidRequestWithUndo';
import InlineEditableText from 'src/client/components/InlineEditableText';
import Row from '../components/Row';

type Props = {
  aidRequestID: string;
  whoIsItFor: string;
};

export default function WhoIsItFor({
  aidRequestID,
  whoIsItFor,
}: Props): JSX.Element {
  const { mutate } = useEditAidRequestWithUndo({
    aidRequestID,
  });

  return (
    <Row divider={true} header="For" headerMonograms={[whoIsItFor]}>
      <InlineEditableText
        save={save}
        style={styles.rowTitle}
        value={whoIsItFor}
      />
    </Row>
  );

  async function save(newValue: string): Promise<unknown> {
    return await mutate({
      aidRequestID,
      input: {
        action: AidRequestUpdateActionType.Add,
        event: AidRequestHistoryEventType.ChangedWhoIsItFor,
        eventSpecificData: newValue,
      },
    });
  }
}

const styles = StyleSheet.create({
  rowTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
