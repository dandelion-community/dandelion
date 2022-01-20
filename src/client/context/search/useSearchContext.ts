import * as React from 'react';
import type { SearchContextType } from 'src/client/context/search/SearchContext';
import SearchContext from 'src/client/context/search/SearchContext';

export default function useSearchContext(): SearchContextType {
  return React.useContext(SearchContext);
}
