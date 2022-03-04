import * as React from 'react';
import RecordAidRequestForm from 'src/client/aid_request/create/RecordAidRequestForm';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import RootNavigationStore from '../../root/RootNavigationStore';

export default function RecordAidRequestScreen(): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <ScrollableScreen
        configs={[
          singleElement({
            key: 'RecordAidRequestForm',
            render: () => <RecordAidRequestForm pop={pop} />,
          }),
        ]}
      />
    </RequireLoggedInScreen>
  );

  function pop(): void {
    const rootNavigation = RootNavigationStore.getValue();
    rootNavigation?.canGoBack()
      ? rootNavigation?.goBack()
      : rootNavigation?.replace('Main');
  }
}
