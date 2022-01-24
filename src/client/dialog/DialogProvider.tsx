import * as React from 'react';
import { Text } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Dialog } from 'react-native-paper';
import DialogContext from 'src/client/dialog/DialogContext';

type Props = {
  children: React.ReactChild;
};

export default function DialogProvider({
  children,
}: Props): React.ReactElement {
  const [resolver, setResolver] = React.useState<{
    resolve: undefined | ((shouldDelete: boolean) => void);
  }>({ resolve: undefined });
  const value = React.useMemo(
    () => ({
      shouldDelete: (): Promise<boolean> => {
        return new Promise(
          (resolve: (shouldDelete: boolean) => void, _reject) => {
            setResolver({ resolve });
          },
        );
      },
    }),
    [],
  );
  const { resolve } = resolver;
  const onResolve = (value: boolean): void => {
    if (resolve != null) {
      resolve(value);
    }
    setResolver({ resolve: undefined });
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal
        isVisible={resolve != null}
        onBackButtonPress={() => onResolve(false)}
        onBackdropPress={() => onResolve(false)}
      >
        <Dialog onDismiss={() => onResolve(false)} visible={resolve != null}>
          <Dialog.Content>
            <Text style={{ fontWeight: 'bold' }}>Confirm Delete</Text>
          </Dialog.Content>
          <Dialog.Content>
            <Text>This cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => onResolve(false)}>Cancel</Button>
            <Button color="red" onPress={() => onResolve(true)}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Modal>
    </DialogContext.Provider>
  );
}
