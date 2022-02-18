import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Header from 'src/client/components/Header';
import ThreeLinesMenuRootScreen from 'src/client/menu/ThreeLinesMenuScreen';
import {
  RootTabScreenProps,
  ThreeLinesMenuStackParamList,
} from 'src/client/navigation/NavigationTypes';
import StackNavigatorInsideTabNavigator from 'src/client/navigation/StackNavigatorInsideTabNavigator';

const Stack = createNativeStackNavigator<ThreeLinesMenuStackParamList>();

export default function ThreeLinesMenuTabStackContainer({
  navigation: _parentNavigation,
}: RootTabScreenProps<'ThreeLinesMenuTabStackContainer'>): React.ReactElement {
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={ThreeLinesMenuRootScreen}
          name="ThreeLinesMenu"
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
