import * as React from 'react';
import useSearchContext from 'src/client/search/useSearchContext';
import type { ListOfAidRequestsQueryVariables } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';

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
  const { searchString } = useSearchContext();
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