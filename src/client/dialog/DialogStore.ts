import createStore from 'src/client/store/createStore';

type DialogState = {
  render: undefined | (() => React.ReactElement);
};

const DialogStore = createStore<DialogState>({ render: undefined });

export default DialogStore;
