import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { publishDraft } from 'src/client/aid_request/drafts/AidRequestDrafts';
import { useColor } from 'src/client/components/Colors';
import ToastStore from 'src/client/toast/ToastStore';
import { AidRequestGraphQLType } from '../fragments/AidRequestGraphQLType';

type Props = {
  aidRequest: AidRequestGraphQLType;
};

export type PublishCallback = {
  publish: () => void;
};

const RetryPublishing = React.forwardRef<PublishCallback, Props>(
  ({ aidRequest }: Props, ref): JSX.Element => {
    const [loadingPublish, setLoadingPublish] = React.useState<boolean>(false);
    const borderColor = useColor('accent');
    const color = useColor('text');
    React.useImperativeHandle(ref, () => ({ publish }));

    return (
      <Pressable onPress={loadingPublish ? null : publish}>
        <View style={[styles.container, { borderColor }]}>
          <Text style={[styles.text, { color }]}>
            {loadingPublish ? 'Retrying...' : 'Retry Publishing'}
          </Text>
        </View>
      </Pressable>
    );

    async function publish(): Promise<void> {
      setLoadingPublish(true);
      const message = await publishDraft(aidRequest._id);
      setLoadingPublish(false);
      ToastStore.update({ message });
    }
  },
);

export default RetryPublishing;

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    borderWidth: 1,
    padding: 5,
    transform: [{ translateY: -5 }],
  },
  text: {
    fontSize: 12,
  },
});
