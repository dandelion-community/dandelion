import {
  DEFAULT_FILTER,
  FilterType,
} from 'src/client/aid_request/filter/RequestExplorerFiltersStore';
import GlobalSearchStringStore from 'src/client/global_search_string/GlobalSearchStringStore';
import useStore from 'src/client/store/useStore';
import RequestExplorerFiltersStore from './RequestExplorerFiltersStore';

export function useRequestExplorerFilters(): FilterType {
  const filter = useStore(RequestExplorerFiltersStore) ?? DEFAULT_FILTER;
  const searchString = useStore(GlobalSearchStringStore);
  return searchString === ''
    ? filter
    : {
        ...filter,
        search: searchString,
      };
}
