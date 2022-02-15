export type Listener<T> = (val: T) => void;

export type EventStream<T> = {
  subscribe: (listener: Listener<T>) => void;
  unsubscribe: (listener: Listener<T>) => void;
  publish: (value: T) => void;
};
