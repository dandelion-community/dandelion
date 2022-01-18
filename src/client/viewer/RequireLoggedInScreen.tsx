import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import LoadingScreen from 'src/client/components/LoadingScreen';
import View from 'src/client/components/View';
import { RootStackParamList } from 'src/client/navigation/NavigationTypes';
import useHandleViewer from 'src/client/viewer/useHandleViewer';
import {
  useIsLoadingLoggedInStatus,
  useIsLoggedOut,
} from 'src/client/viewer/ViewerContext';

type Props = {
  children: React.ReactElement;
};

export default function RequireLoggedInScreen({
  children,
}: Props): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
  const isLoadingLoggedInStatus = useIsLoadingLoggedInStatus();
  const isLoggedOut = useIsLoggedOut();
  useHandleViewer(navigation, 'Main', {
    loggedOut: async () => {
      navigation.push('NotLoggedIn');
    },
  });
  if (isLoadingLoggedInStatus) {
    return <LoadingScreen />;
  }
  if (isLoggedOut) {
    // useHandleViewer (above) will push NotLoggedInScreen
    return <View />;
  }
  return children;
}
