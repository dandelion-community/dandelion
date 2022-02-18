import createStore from 'src/client/store/createStore';

export type ToastConfig = {
  message: string;
  undo?: null | (() => Promise<void>);
};

const ToastStore = createStore<ToastConfig | undefined>(undefined);

export default ToastStore;
