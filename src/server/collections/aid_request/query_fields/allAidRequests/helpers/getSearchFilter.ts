import { PipelineStage } from 'mongoose';
import getEnvironmentVariableAndThrowIfNotFound from 'src/shared/env/getEnvironmentVariableAndThrowIfNotFound';
import type { Filter } from './types';

const index = getEnvironmentVariableAndThrowIfNotFound(
  'MONGO_AID_REQUEST_INDEX_NAME',
);

export default function getSearchFilter(
  filter: Filter,
): null | PipelineStage.Search {
  const { search } = filter;
  if (!search) {
    return null;
  }
  return {
    $search: {
      index,
      text: {
        path: {
          wildcard: '*',
        },
        query: search,
      },
    },
  };
}
