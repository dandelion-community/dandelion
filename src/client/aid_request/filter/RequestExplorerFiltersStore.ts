import * as FilterEncoder from 'src/client/aid_request/filter/FilterEncoder';
import type { ListOfAidRequestsQueryVariables } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import { RequestExplorerStackParamList } from 'src/client/navigation/NavigationTypes';
import createStore from 'src/client/store/createStore';

export type FilterType = NonNullable<ListOfAidRequestsQueryVariables['filter']>;

export const DEFAULT_FILTER: FilterType = { completed: false };

const RequestExplorerFiltersStore = createStore<FilterType | undefined>(
  undefined,
);

export function getArg(): Pick<
  RequestExplorerStackParamList['RequestExplorer'],
  'f'
> {
  const encoded = FilterEncoder.encode(
    RequestExplorerFiltersStore.getValue() ?? DEFAULT_FILTER,
  );
  return encoded == null ? {} : { f: encoded };
}

export default RequestExplorerFiltersStore;
