import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../../../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../../../../general-purpose/components/light-or-dark-themed/useColorScheme';
import StackNavigatorInsideTabNavigator from '../../../../../general-purpose/navigation/StackNavigatorInsideTabNavigator';
import type { RootTabScreenProps } from '../../../NavigationTypes';
import { CreateRequestStackParamList } from '../../../NavigationTypes';
import CreateRequestRootScreen from './CreateRequestScreen';

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
