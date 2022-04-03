import type { AidRequestCardFragment } from 'src/client/aid_request/fragments/__generated__/AidRequestCardFragment';
import { ListOfAidRequestsQuery_allAidRequests_edges } from '../list/__generated__/ListOfAidRequestsQuery';

export type AidRequestGraphQLType = Omit<AidRequestCardFragment, '_id'> & {
  _id: NonNullable<AidRequestCardFragment['_id']>;
};

export type AidRequestGraphQLEdgeType = {
  __typename: 'AidRequestEdge';
  node: AidRequestGraphQLType;
};

export const invalid_counter: { current: number } = {
  current: 0,
};

export function validate(
  arg: AidRequestCardFragment | undefined | null,
): AidRequestGraphQLType | undefined {
  if (arg == null) {
    return undefined;
  }
  const { _id, ...rest } = arg;
  if (_id == null) {
    invalid_counter.current++;
    return undefined;
  }
  return { _id, ...rest };
}

export function validateEdge(
  arg: ListOfAidRequestsQuery_allAidRequests_edges,
): AidRequestGraphQLEdgeType | undefined {
  const node = validate(arg.node);
  if (node == null) {
    return undefined;
  }
  return {
    __typename: 'AidRequestEdge',
    node,
  };
}
