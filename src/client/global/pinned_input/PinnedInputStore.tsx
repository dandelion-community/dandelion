import createStore from 'src/client/store/createStore';

export type PinnedInputConfig = {
  render: (() => React.ReactElement) | undefined;
};

const PinnedInputStore = createStore<PinnedInputConfig>({ render: undefined });

export default PinnedInputStore;
