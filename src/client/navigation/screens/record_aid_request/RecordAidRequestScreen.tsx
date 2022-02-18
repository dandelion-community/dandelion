import * as React from 'react';
import RecordAidRequestForm from 'src/client/aid_request/create/RecordAidRequestForm';
import ScrollableScreen from 'src/client/components/ScrollableScreen';
import useRootNavigation from 'src/client/navigation/useRootNavigation';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

export default function RecordAidRequestScreen(): React.ReactElement {
  const rootNavigation = useRootNavigation();
  return (
    <RequireLoggedInScreen>
      <ScrollableScreen>
        <RecordAidRequestForm
          pop={() => {
            rootNavigation.canGoBack()
              ? rootNavigation.goBack()
              : rootNavigation.replace('Main');
          }}
        />
      </ScrollableScreen>
    </RequireLoggedInScreen>
  );
}
