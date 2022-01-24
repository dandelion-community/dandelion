import * as React from 'react';
import SearchContext from 'src/client/context/search/SearchContext';

type Props = {
  children: React.ReactChild[];
};

export default function SearchProvider({
  children,
}: Props): React.ReactElement {
  const [searchString, setSearchString] = React.useState<string>('');
  const value = React.useMemo(
    () => ({
      searchString,
      setSearchString,
    }),
    [searchString],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
