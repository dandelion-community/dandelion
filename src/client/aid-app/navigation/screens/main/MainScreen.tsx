import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import Colors from '../../../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../../../general-purpose/components/light-or-dark-themed/useColorScheme';
import {
  RootStackScreenProps,
  RootTabParamList,
  RootTabScreenProps,
} from '../../NavigationTypes';
import useSetRootNavigation from '../../useSetRootNavigation';
import CreateRequestTabStackContainer from './create_request/CreateRequestTabStackContainer';
import RequestExplorerTabStackContainer from './request_explorer/RequestExplorerTabStackContainer';
import ThreeLinesMenuTabStackContainer from './three_lines_menu/ThreeLinesMenuTabStackContainer';

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

export default function MainScreen({
  navigation,
}: RootStackScreenProps<'Main'>): React.ReactElement {
  const colorScheme = useColorScheme();
  useSetRootNavigation(navigation);
  return (
    <BottomTab.Navigator
      activeColor={Colors[colorScheme].tabIconSelected}
      barStyle={{ backgroundColor: Colors[colorScheme].tabBarBackground }}
      inactiveColor={Colors[colorScheme].tabIconDefault}
      initialRouteName="RequestExplorerTabStackContainer"
      shifting={true}
    >
      <BottomTab.Screen
        component={RequestExplorerTabStackContainer}
        name="RequestExplorerTabStackContainer"
        options={({
          navigation: _navigation,
        }: RootTabScreenProps<'RequestExplorerTabStackContainer'>) => {
          return {
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon color={color} focused={focused} name="handshake-o" />
            ),
            title: 'All Requests',
          };
        }}
      />
      <BottomTab.Screen
        component={CreateRequestTabStackContainer}
        name="CreateRequestTabStackContainer"
        options={({
          navigation: _navigation,
        }: RootTabScreenProps<'CreateRequestTabStackContainer'>) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="plus-circle" />
          ),
          title: 'Create Request',
        })}
      />
      <BottomTab.Screen
        component={ThreeLinesMenuTabStackContainer}
        name="ThreeLinesMenuTabStackContainer"
        options={({
          navigation: _navigation,
        }: RootTabScreenProps<'ThreeLinesMenuTabStackContainer'>) => ({
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="bars" />
          ),
          title: 'Menu',
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <FontAwesome
      size={props.focused ? 23 : 19}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}
