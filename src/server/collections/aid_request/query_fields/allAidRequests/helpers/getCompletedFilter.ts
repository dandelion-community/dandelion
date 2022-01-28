import { PipelineStage } from 'mongoose';
import type { Filter } from './types';

export default function getCompletedFilter(
  filter: Filter,
): null | PipelineStage {
  const { completed } = filter;
  if (completed == null) {
    return null;
  }
  return {
    $match: {
      completed,
    },
  };
}
