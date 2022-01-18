import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from 'components/Colors';
import useColorScheme from 'light-or-dark/useColorScheme';
import ThreeLinesMenuRootScreen from 'menu/ThreeLinesMenuScreen';
import {
  RootTabScreenProps,
  ThreeLinesMenuStackParamList,
} from 'navigation/NavigationTypes';
import StackNavigatorInsideTabNavigator from 'navigation/StackNavigatorInsideTabNavigator';
import * as React from 'react';
import { Appbar } from 'react-native-paper';

const Stack = createNativeStackNavigator<ThreeLinesMenuStackParamList>();

export default function ThreeLinesMenuTabStackContainer({
  navigation: _parentNavigation,
}: RootTabScreenProps<'ThreeLinesMenuTabStackContainer'>): React.ReactElement {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <StackNavigatorInsideTabNavigator>
      <Stack.Navigator>
        <Stack.Screen
          component={ThreeLinesMenuRootScreen}
          name="ThreeLinesMenu"
          options={() => ({
            header: ({ options }) => (
              <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
                <Appbar.Content title={options.title} />
              </Appbar.Header>
            ),
            title: 'Menu',
          })}
        />
      </Stack.Navigator>
    </StackNavigatorInsideTabNavigator>
  );
}
