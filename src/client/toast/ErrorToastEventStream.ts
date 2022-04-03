import { ApolloError } from '@apollo/client';
import createEventStream from 'src/client/event_stream/createEventStream';

export type ErrorToastEventStreamEvent = {
  error: ApolloError;
  message: string;
};

const ErrorToastEventStream = createEventStream<ErrorToastEventStreamEvent>();

export default ErrorToastEventStream;
