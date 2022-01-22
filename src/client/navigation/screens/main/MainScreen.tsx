import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import Colors from 'src/client/components/Colors';
import AidRequestCreateDrawer from 'src/client/create_request/AidRequestCreateDrawer';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import createMaterialBottomTabNavigator from 'src/client/navigation/bottom-navigator/createMaterialBottomTabNavigator';
import {
  RootStackScreenProps,
  RootTabParamList,
  RootTabScreenProps,
} from 'src/client/navigation/NavigationTypes';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import CreateRequestTabStackContainer from '../../../create_request/CreateRequestTabStackContainer';
import ThreeLinesMenuTabStackContainer from '../../../menu/ThreeLinesMenuTabStackContainer';
import RequestExplorerTabStackContainer from '../../../request_explorer/RequestExplorerTabStackContainer';

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
  const { openDrawer } = useDrawerContext();
  return (
    <BottomTab.Navigator
      activeColor={Colors[colorScheme].tabIconSelected}
      barStyle={{ backgroundColor: Colors[colorScheme].tabBarBackground }}
      inactiveColor={Colors[colorScheme].tabIconDefault}
      initialRouteName="RequestExplorerTabStackContainer"
      onFABPress={() => {
        openDrawer(renderCreateDrawerContents);
      }}
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

  function renderCreateDrawerContents(): React.ReactElement {
    return <AidRequestCreateDrawer />;
  }
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
