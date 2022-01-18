import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from 'components/Colors';
import CreateRequestRootScreen from 'create_request/CreateRequestScreen';
import useColorScheme from 'light-or-dark/useColorScheme';
import type { RootTabScreenProps } from 'navigation/NavigationTypes';
import { CreateRequestStackParamList } from 'navigation/NavigationTypes';
import StackNavigatorInsideTabNavigator from 'navigation/StackNavigatorInsideTabNavigator';
import * as React from 'react';
import { Appbar } from 'react-native-paper';

const Stack = createNativeStackNavigator<CreateRequestStackParamList>();

export default function CreateRequestTabStackNavigator({
  navigation: _parentNavigation,
}: RootTabScreenProps<'CreateRequestTabStackContainer'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={CreateRequestRootScreen}
          name="CreateRequest"
          options={() => ({
            header: ({ options }) => (
              <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
                <Appbar.Content title={options.title} />
              </Appbar.Header>
            ),
            title: 'Create Request',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );
}
