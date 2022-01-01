import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../../../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../../../../general-purpose/components/light-or-dark-themed/useColorScheme';
import StackNavigatorInsideTabNavigator from '../../../../../general-purpose/navigation/StackNavigatorInsideTabNavigator';
import {
  RootTabScreenProps,
  ThreeLinesMenuStackParamList,
} from '../../../NavigationTypes';
import ThreeLinesMenuRootScreen from './ThreeLinesMenuScreen';

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
