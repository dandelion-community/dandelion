import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'src/client/utils/debounce';
import { CommentDraftEventStreamType } from './CommentDraftEventStreamType';

const ROOT_KEY =
  'src/client/aid_request/detail/add-a-comment/draft/DraftComment.ts';

type GetArgs = Omit<CommentDraftEventStreamType, 'commentContents'>;

export const saveDraftComment = debounce(saveDraftCommentImpl);

async function saveDraftCommentImpl(
  event: CommentDraftEventStreamType,
): Promise<void> {
  const { commentContents } = event;
  const key = getKey(event);
  if (commentContents) {
    await AsyncStorage.setItem(key, event.commentContents);
  } else {
    await AsyncStorage.removeItem(key);
  }
}

export async function getDraftComment(args: GetArgs): Promise<string | null> {
  const key = getKey(args);
  return await AsyncStorage.getItem(key);
}

function getKey({ viewerID, aidRequestID }: GetArgs): string {
  return `${ROOT_KEY}:${viewerID}:${aidRequestID}`;
}
