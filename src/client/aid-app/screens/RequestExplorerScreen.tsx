import type {
  NativeStackHeaderProps,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import {
  RequestExplorerStackParamList,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  RootTabScreenProps,
} from '../navigation/NavigationTypes';
import CreateRequestScreen from './CreateRequestScreen';
import PersonDetailsScreen from './PersonDetailsScreen';
import RequestExplorerRootScreen from './RequestExplorerRootScreen';

const Stack = createNativeStackNavigator<RequestExplorerStackParamList>();

export type ExtraProps = { navigateToProfile: () => void };

export default function RequestExplorerScreen({
  navigation: _parentNavigation,
}: RootTabScreenProps<'RequestExplorer'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={RequestExplorerRootScreen}
        name="RequestExplorerRoot"
        options={() => ({
          header: ({ options }) => (
            <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
              <Appbar.Content title={options.title} />
            </Appbar.Header>
          ),
          title: 'All Requests',
        })}
      />
      <Stack.Screen
        component={CreateRequestScreen}
        name="CreateRequest"
        options={() => ({
          header: headerWithBackToRoot,
          title: 'Create Request',
        })}
      />
      <Stack.Screen
        component={PersonDetailsScreen}
        name="PersonDetails"
        options={() => ({
          header: headerWithBackToRoot,
          title: '',
        })}
      />
    </Stack.Navigator>
  );

  function headerWithBackToRoot<
    RouteName extends keyof RequestExplorerStackParamList,
  >({ navigation, options }: NativeStackHeaderProps): React.ReactNode {
    return (
      <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
        {backToRootAction(
          navigation as NativeStackNavigationProp<
            RequestExplorerStackParamList,
            RouteName
          >,
        )}
        <Appbar.Content title={options.title} />
      </Appbar.Header>
    );
  }
}

function backToRootAction<
  RouteName extends keyof RequestExplorerStackParamList,
>(
  navigation: NativeStackNavigationProp<
    RequestExplorerStackParamList,
    RouteName
  >,
): JSX.Element {
  return (
    <Appbar.BackAction
      onPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.replace('RequestExplorerRoot')
      }
    />
  );
}
