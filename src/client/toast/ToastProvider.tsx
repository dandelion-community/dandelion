import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import useStore from '../store/useStore';
import ToastStore from './ToastStore';

type Props = {
  children: React.ReactChild;
};

export default function ToastProvider({ children }: Props): React.ReactElement {
  const toastContext = useStore(ToastStore);

  return (
    <>
      {children}
      <View style={styles.snackbar}>
        <Snackbar
          action={
            toastContext?.undo == null
              ? undefined
              : {
                  label: 'Undo',
                  onPress: toastContext?.undo,
                }
          }
          onDismiss={() => {
            ToastStore.update(undefined);
          }}
          visible={toastContext != null}
        >
          {toastContext?.message ?? ''}
        </Snackbar>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    bottom: 80,
    elevation: 1,
    left: 0,
    minWidth: '100%',
    position: 'absolute',
  },
});
