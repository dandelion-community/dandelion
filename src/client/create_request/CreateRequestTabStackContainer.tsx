import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import CreateRequestRootScreen from 'src/client/create_request/CreateRequestScreen';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import type { RootTabScreenProps } from 'src/client/navigation/NavigationTypes';
import { CreateRequestStackParamList } from 'src/client/navigation/NavigationTypes';
import StackNavigatorInsideTabNavigator from 'src/client/navigation/StackNavigatorInsideTabNavigator';

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
