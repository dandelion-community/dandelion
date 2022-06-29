import { PipelineStage } from 'mongoose';
import env from 'src/shared/env/env';
import type { Filter } from './types';

export default function getSearchFilter(
  filter: Filter,
): null | PipelineStage.Search {
  const { search } = filter;
  if (!search) {
    return null;
  }
  return {
    $search: {
      index: env.MONGO_AID_REQUEST_INDEX_NAME,
      text: {
        path: {
          wildcard: '*',
        },
        query: search,
      },
    },
  };
}
