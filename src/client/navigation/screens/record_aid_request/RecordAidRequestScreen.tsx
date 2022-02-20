import * as React from 'react';
import RecordAidRequestForm from 'src/client/aid_request/create/RecordAidRequestForm';
import useRootNavigation from 'src/client/navigation/useRootNavigation';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

export default function RecordAidRequestScreen(): React.ReactElement {
  const rootNavigation = useRootNavigation();
  return (
    <RequireLoggedInScreen>
      <ScrollableScreen
        configs={[
          singleElement({
            render: () => <RecordAidRequestForm pop={pop} />,
            key: 'RecordAidRequestForm',
          }),
        ]}
      />
    </RequireLoggedInScreen>
  );

  function pop(): void {
    rootNavigation.canGoBack()
      ? rootNavigation.goBack()
      : rootNavigation.replace('Main');
  }
}
