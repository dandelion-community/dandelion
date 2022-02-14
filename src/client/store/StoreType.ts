export type Listener<T> = (val: T) => void;

export type Store<T> = {
  getValue: () => T;
  subscribe: (listener: Listener<T>) => void;
  unsubscribe: (listener: Listener<T>) => void;
  update: (value: T) => void;
};
