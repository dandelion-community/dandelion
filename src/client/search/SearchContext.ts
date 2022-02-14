import * as React from 'react';

export type SearchContextType = {
  searchString: string;
  setSearchString: (value: string) => void;
};

const SearchContext = React.createContext<SearchContextType>({
  searchString: '',
  setSearchString: () => {
    console.error('Attempted to set search string outside of a SearchContext');
  },
});

export default SearchContext;
