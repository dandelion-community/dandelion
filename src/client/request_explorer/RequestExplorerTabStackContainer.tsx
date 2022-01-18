import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import {
  RequestExplorerStackParamList,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  RootTabScreenProps,
} from 'src/client/navigation/NavigationTypes';
import StackNavigatorInsideTabNavigator from 'src/client/navigation/StackNavigatorInsideTabNavigator';
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
