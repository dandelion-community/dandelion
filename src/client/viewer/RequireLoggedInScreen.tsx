import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingScreen from 'components/LoadingScreen';
import View from 'components/View';
import { RootStackParamList } from 'navigation/NavigationTypes';
import * as React from 'react';
import useHandleViewer from 'viewer/useHandleViewer';
import {
  useIsLoadingLoggedInStatus,
  useIsLoggedOut,
} from 'viewer/ViewerContext';

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
