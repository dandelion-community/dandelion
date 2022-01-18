import type { ListOfAidRequestsQueryVariables } from 'request_explorer/__generated__/ListOfAidRequestsQuery';
import * as React from 'react';

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
  return React.useContext<Filters>(RequestExplorerFiltersContext);
}
