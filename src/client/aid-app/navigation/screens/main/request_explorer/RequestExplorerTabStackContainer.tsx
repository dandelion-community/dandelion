import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../../../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../../../../general-purpose/components/light-or-dark-themed/useColorScheme';
import StackNavigatorInsideTabNavigator from '../../../../../general-purpose/navigation/StackNavigatorInsideTabNavigator';
import {
  RequestExplorerStackParamList,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  RootTabScreenProps,
} from '../../../NavigationTypes';
import RequestExplorerRootScreen from './RequestExplorerScreen';
import RequestHistoryScreen from './RequestHistoryScreen';

const Stack = createNativeStackNavigator<RequestExplorerStackParamList>();

export type ExtraProps = { navigateToProfile: () => void };

export default function RequestExplorerTabStackContainer({
  navigation: _parentNavigation,
}: RootTabScreenProps<'RequestExplorerTabStackContainer'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={RequestExplorerRootScreen}
          name="RequestExplorer"
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
          component={RequestHistoryScreen}
          name="RequestHistory"
          options={() => ({
            header: ({ options }) => (
              <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
                <Appbar.Content title={options.title} />
              </Appbar.Header>
            ),
            title: 'Request History',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );
}
