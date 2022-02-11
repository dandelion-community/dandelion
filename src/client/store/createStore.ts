import type { Listener, Store } from 'src/client/store/StoreType';

export default function createStore<T>(initialValue: T): Store<T> {
  let value: T = initialValue;
  const listeners: Set<Listener<T>> = new Set();

  return {
    getValue,
    subscribe,
    unsubscribe,
    update,
  };

  function getValue(): T {
    return value;
  }

  function subscribe(listener: Listener<T>): void {
    listeners.add(listener);
  }

  function unsubscribe(listener: Listener<T>): void {
    listeners.delete(listener);
  }

  function update(val: T): void {
    value = val;
    listeners.forEach((listener: Listener<T>): void => {
      listener(value);
    });
  }
}
