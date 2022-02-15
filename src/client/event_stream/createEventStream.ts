import type {
  EventStream,
  Listener,
} from 'src/client/event_stream/EventStreamType';

export default function createEventStream<T>(): EventStream<T> {
  const listeners: Set<Listener<T>> = new Set();

  return {
    publish,
    subscribe,
    unsubscribe,
  };

  function subscribe(listener: Listener<T>): void {
    listeners.add(listener);
  }

  function unsubscribe(listener: Listener<T>): void {
    listeners.delete(listener);
  }

  function publish(val: T): void {
    listeners.forEach((listener: Listener<T>): void => {
      listener(val);
    });
  }
}
