import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Header from 'src/client/components/Header';
import MenuRootScreen from 'src/client/menu/MenuScreen';
import StackNavigatorInsideTabNavigator from 'src/client/navigation/helpers/StackNavigatorInsideTabNavigator';
import {
  MenuStackParamList,
  RootTabScreenProps,
} from 'src/client/navigation/NavigationTypes';

const Stack = createNativeStackNavigator<MenuStackParamList>();

export default function MenuTabStackContainer({
  navigation: _parentNavigation,
}: RootTabScreenProps<'MenuTabStackContainer'>): React.ReactElement {
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={MenuRootScreen}
          name="Menu"
          options={() => ({
            header: ({ options }) => (
              <Header>
                <Appbar.Content title={options.title} />
              </Header>
            ),
            title: 'Menu',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );
}
