import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { initializeAidRequestDrafts } from 'src/client/aid_request/drafts/AidRequestDraftsMemoryStore';
import reportError from 'src/client/error/reportError';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        await Promise.all([
          Font.loadAsync({
            ...FontAwesome.font,
          }),
          initializeAidRequestDrafts(),
        ]);
      } catch (e) {
        reportError(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
