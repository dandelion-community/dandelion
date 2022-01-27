import dotenv from 'dotenv';
import { PipelineStage } from 'mongoose';
import type { Filter } from './types';

dotenv.config();

export default function getSearchFilter(
  filter: Filter,
): null | PipelineStage.Search {
  const { search } = filter;
  if (!search) {
    return null;
  }
  return {
    $search: {
      index: process.env.MONGO_AID_REQUEST_INDEX_NAME,
      text: {
        path: {
          wildcard: '*',
        },
        query: search,
      },
    },
  };
}
