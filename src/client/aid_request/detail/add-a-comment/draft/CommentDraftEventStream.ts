import { CommentDraftEventStreamType } from 'src/client/aid_request/detail/add-a-comment/draft/CommentDraftEventStreamType';
import { saveDraftComment } from 'src/client/aid_request/detail/add-a-comment/draft/DraftComment';
import createEventStream from 'src/client/event_stream/createEventStream';

const CommentDraftEventStream =
  createEventStream<CommentDraftEventStreamType>();

CommentDraftEventStream.subscribe(saveDraftComment);

export default CommentDraftEventStream;
