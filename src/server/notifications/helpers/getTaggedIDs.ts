import filterNulls from 'src/shared/utils/filterNulls';
import MentionPartType from 'src/shared/utils/MentionPartType';
import { parseValue } from 'src/shared/utils/mention_utils';
import type { Part } from 'src/shared/utils/types';
import uniques from 'src/shared/utils/uniques';

export default function getTaggedIDs(message: string): Array<string> {
  const { parts } = parseValue(message, [MentionPartType]);
  return uniques(
    filterNulls(parts.map((part: Part): string | undefined => part.data?.id)),
  );
}
