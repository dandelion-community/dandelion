import * as React from 'react';
import type { ListOfAidRequestsQueryVariables } from '../../../../../aid_requests/__generated__/ListOfAidRequestsQuery';

export type FilterType = ListOfAidRequestsQueryVariables['filter'];

export type Filters = {
  filter: FilterType;
  setFilters: (filters: FilterType) => void;
};

export const RequestExplorerFiltersContext = React.createContext<Filters>({
  filter: null,
  setFilters: () => undefined,
});

export function useRequestExplorerFilters(): Filters {
  return React.useContext<Filters>(RequestExplorerFiltersContext);
}
