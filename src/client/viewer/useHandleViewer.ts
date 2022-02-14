import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { RootStackParamList } from 'src/client/navigation/NavigationTypes';
import Loading from 'src/client/utils/Loading';
import type {
  LoggedInViewer,
  LoggedOutViewer,
  Viewer,
} from 'src/client/viewer/ViewerContext';
import { useViewerContext } from 'src/client/viewer/ViewerContext';

type Handler<TContext extends Viewer> = (
  viewer: TContext,
  goToMain: () => void,
) => Promise<void>;

type Handlers = Readonly<{
  loggedIn?: Handler<LoggedInViewer>;
  loggedOut?: Handler<LoggedOutViewer>;
}>;

export default function useHandleViewer<
  Screen extends keyof RootStackParamList,
>(
  navigation: NativeStackNavigationProp<RootStackParamList, Screen>,
  screenKey: Screen,
  handlers: Handlers,
  dependencies?: ReadonlyArray<unknown>,
): void {
  const viewer = useViewerContext();
  React.useEffect(() => {
    handleUpdate();
    navigation.addListener('focus', handleUpdate);
    return () => navigation.removeListener('focus', handleUpdate);

    function handleUpdate(): void {
      setTimeout(() => {
        if (!navigation.isFocused()) {
          // This screen is not focused
          return;
        }
        if (viewer.username === Loading) {
          // Don't do anything if context is still loading
          return;
        }
        if (viewer.username != null) {
          handlers.loggedIn?.(viewer, goToMain);
        } else {
          handlers.loggedOut?.(viewer, goToMain);
        }
      }, 250);
    }

    function goToMain(): void {
      navigation.canGoBack() ? navigation.goBack() : navigation.replace('Main');
    }
  }, [screenKey, navigation, handlers, viewer, ...(dependencies ?? [])]);
}
