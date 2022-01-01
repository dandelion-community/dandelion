import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { RootStackParamList } from '../../aid-app/navigation/NavigationTypes';
import useHandleViewer from '../viewer/useHandleViewer';
import {
  useIsLoadingLoggedInStatus,
  useIsLoggedOut,
} from '../viewer/ViewerContext';
import View from './light-or-dark-themed/View';
import LoadingScreen from './LoadingScreen';

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
