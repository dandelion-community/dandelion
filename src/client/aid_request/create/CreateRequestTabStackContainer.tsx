import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import CreateRequestRootScreen from 'src/client/aid_request/create/CreateRequestScreen';
import Header from 'src/client/components/Header';
import type { RootTabScreenProps } from 'src/client/navigation/NavigationTypes';
import { CreateRequestStackParamList } from 'src/client/navigation/NavigationTypes';
import StackNavigatorInsideTabNavigator from 'src/client/navigation/StackNavigatorInsideTabNavigator';

const Stack = createNativeStackNavigator<CreateRequestStackParamList>();

export default function CreateRequestTabStackNavigator({
  navigation: _parentNavigation,
}: RootTabScreenProps<'CreateRequestTabStackContainer'>): JSX.Element {
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={CreateRequestRootScreen}
          name="CreateRequest"
          options={() => ({
            header: ({ options }) => (
              <Header>
                <Appbar.Content title={options.title} />
              </Header>
            ),
            title: 'Create Request',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );
}
