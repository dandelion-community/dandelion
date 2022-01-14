import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import type { ToastConfig } from './ToastContext';
import ToastContext from './ToastContext';

type Props = {
  children: React.ReactChild;
};

export default function ToastProvider({ children }: Props): React.ReactElement {
  const windowWidth = Dimensions.get('window').width;
  const [toastContext, setToastContext] = React.useState<
    ToastConfig | undefined
  >(undefined);
  const value = React.useMemo(
    () => ({
      publishToast: setToastContext,
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={[styles.snackbar, { minWidth: windowWidth - 32 }]}>
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
            setToastContext(undefined);
          }}
          visible={toastContext != null}
        >
          {toastContext?.message ?? ''}
        </Snackbar>
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    bottom: 40,
    elevation: 1,
    margin: 16,
    position: 'absolute',
  },
});
