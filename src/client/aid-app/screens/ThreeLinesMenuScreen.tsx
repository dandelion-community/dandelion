import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import {
  RootTabScreenProps,
  ThreeLinesMenuStackParamList,
} from '../navigation/NavigationTypes';
import ThreeLinesMenuRootScreen from './ThreeLinesMenuRootScreen';

const Stack = createNativeStackNavigator<ThreeLinesMenuStackParamList>();

export default function ThreeLinesMenuScreen({
  navigation: _parentNavigation,
}: RootTabScreenProps<'ThreeLinesMenu'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={ThreeLinesMenuRootScreen}
        name="ThreeLinesMenuRoot"
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
  );
}
