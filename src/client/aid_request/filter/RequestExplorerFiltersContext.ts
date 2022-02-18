import * as React from 'react';
import type { ListOfAidRequestsQueryVariables } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import GlobalSearchStringStore from 'src/client/global_search_string/GlobalSearchStringStore';
import useStore from 'src/client/store/useStore';

export type FilterType = NonNullable<ListOfAidRequestsQueryVariables['filter']>;

export const DEFAULT_FILTER: FilterType = { completed: false };

export type Filters = {
  filter: FilterType;
  setFilters: (filters: FilterType) => void;
};

export const RequestExplorerFiltersContext = React.createContext<Filters>({
  filter: DEFAULT_FILTER,
  setFilters: () => undefined,
});

export function useRequestExplorerFilters(): Filters {
  const { filter, setFilters } = React.useContext<Filters>(
    RequestExplorerFiltersContext,
  );
  const searchString = useStore(GlobalSearchStringStore);
  const filterWithSearchString: FilterType =
    searchString === ''
      ? filter
      : {
          ...filter,
          search: searchString,
        };
  return {
    filter: filterWithSearchString,
    setFilters,
  };
}
