import * as React from 'react';
import CreateRequestTabStackContainer from 'src/client/aid_request/create/CreateRequestTabStackContainer';
import RequestExplorerTabStackContainer from 'src/client/aid_request/explorer/RequestExplorerTabStackContainer';
import Colors from 'src/client/components/Colors';
import Icon from 'src/client/components/Icon';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import MenuTabStackContainer from 'src/client/menu/MenuTabStackContainer';
import createMaterialBottomTabNavigator from 'src/client/navigation/bottom-navigator/createMaterialBottomTabNavigator';
import {
  RootStackScreenProps,
  RootTabParamList,
  RootTabScreenProps,
} from 'src/client/navigation/NavigationTypes';

const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

export default function MainScreen({
  navigation,
}: RootStackScreenProps<'Main'>): React.ReactElement {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      activeColor={Colors[colorScheme].tabIconSelected}
      barStyle={{ backgroundColor: Colors[colorScheme].tabBarBackground }}
      inactiveColor={Colors[colorScheme].tabIconDefault}
      initialRouteName="RequestExplorerTabStackContainer"
      onFABPress={() => {
        navigation.push('Record Request');
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
              <TabBarIcon color={color} focused={focused} name="handshake" />
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
        component={MenuTabStackContainer}
        name="MenuTabStackContainer"
        options={({
          navigation: _navigation,
        }: RootTabScreenProps<'MenuTabStackContainer'>) => ({
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="menu" />
          ),
          title: 'Menu',
        })}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: { name: string; color: string; focused: boolean }) {
  return <Icon path={props.name} size={props.focused ? 23 : 19} />;
}
