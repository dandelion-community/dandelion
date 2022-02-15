import createEventStream from 'src/client/event_stream/createEventStream';

const AidRequestUpdatedIDsEventStream = createEventStream<string[]>();

export default AidRequestUpdatedIDsEventStream;
