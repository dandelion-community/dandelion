import { Text } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Dialog } from 'react-native-paper';
import DialogStore from './DialogStore';

export default function confirmDelete(): Promise<boolean> {
  return new Promise((resolve: (val: boolean) => void): void => {
    DialogStore.update({
      render,
    });

    function render(): React.ReactElement {
      return (
        <Modal
          isVisible={true}
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
      );
    }

    function onResolve(value: boolean): void {
      resolve(value);
      DialogStore.update({ render: undefined });
    }
  });
}
