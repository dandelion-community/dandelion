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
import AidRequestDetailScreen from '../aid_request/detail/AidRequestDetailScreen';
import RequestExplorerHeader from './RequestExplorerHeader';
import RequestExplorerScreen from './RequestExplorerScreen';

const Stack = createNativeStackNavigator<RequestExplorerStackParamList>();

export type ExtraProps = { navigateToProfile: () => void };

export default function RequestExplorerTabStackContainer({
  navigation,
}: RootTabScreenProps<'RequestExplorerTabStackContainer'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={RequestExplorerScreen}
          name="RequestExplorer"
          options={() => ({
            header: () => <RequestExplorerHeader />,
            title: 'All Requests',
          })}
        />
        <Stack.Screen
          component={AidRequestDetailScreen}
          name="AidRequestDetail"
          options={() => ({
            header: ({ options }) => (
              <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
                <Appbar.BackAction
                  onPress={() =>
                    navigation?.canGoBack()
                      ? navigation.goBack()
                      : navigation?.replace('Main')
                  }
                />
                <Appbar.Content title={options.title} />
              </Appbar.Header>
            ),
            title: 'Request',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );
}
