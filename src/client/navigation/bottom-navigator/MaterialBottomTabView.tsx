/**
 * This file is mostly copied from react-navigation
 * https://github.com/react-navigation/react-navigation/blob/main/packages/material-bottom-tabs/src/views/MaterialBottomTabView.tsx
 * 
 * Meaningfully modified portions are enclosed with // {MODIFIED} and // {END MODIFIED}
 * 
 * I know forking is a thing but I don't really know how to do it and don't want to slow myself down by learning :p
 * 
 * react-navigation/material-bottom-tabs's license is as follows:
 * https://github.com/react-navigation/react-navigation/blob/main/packages/material-bottom-tabs/LICENSE
 * 
 * 
MIT License

Copyright (c) 2017 React Navigation Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import { SafeAreaProviderCompat } from '@react-navigation/elements';
import {
  CommonActions,
  Link,
  ParamListBase,
  Route,
  TabNavigationState,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavigation from './BottomNavigation';
import type {
  MaterialBottomTabDescriptorMap,
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationHelpers,
} from './types';

type Props = MaterialBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: MaterialBottomTabNavigationHelpers;
  descriptors: MaterialBottomTabDescriptorMap;
} & {
  // {MODIFIED}
  onFABPress: () => void;
  // {END MODIFIED}
};

type Scene = { route: { key: string } };

function MaterialBottomTabViewInner({
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();
  const { dark, colors } = useTheme();
  const buildLink = useLinkBuilder();

  const theme = React.useMemo(() => {
    const t = dark ? DarkTheme : DefaultTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...colors,
        surface: colors.card,
      },
    };
  }, [colors, dark]);

  return (
    <BottomNavigation
      {...rest}
      getAccessibilityLabel={({ route }) =>
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      getBadge={({ route }) => descriptors[route.key].options.tabBarBadge}
      getColor={({ route }) => descriptors[route.key].options.tabBarColor}
      getLabelText={({ route }: Scene) => {
        const { options } = descriptors[route.key];

        return options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : (route as Route<string>).name;
      }}
      getTestID={({ route }) => descriptors[route.key].options.tabBarTestID}
      navigationState={state}
      onIndexChange={(index: number) =>
        navigation.dispatch({
          ...CommonActions.navigate({
            merge: true,
            name: state.routes[index].name,
          }),
          target: state.key,
        })
      }
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          canPreventDefault: true,
          target: route.key,
          type: 'tabPress',
        });

        if (event.defaultPrevented) {
          preventDefault();
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];

        if (typeof options.tabBarIcon === 'string') {
          return (
            <MaterialCommunityIcons
              color={color}
              name={options.tabBarIcon}
              size={24}
              style={styles.icon}
            />
          );
        }

        if (typeof options.tabBarIcon === 'function') {
          return options.tabBarIcon({ color, focused });
        }

        return null;
      }}
      renderScene={({ route }) => descriptors[route.key].render()}
      renderTouchable={
        Platform.OS === 'web'
          ? ({
              onPress,
              route,
              accessibilityRole: _0,
              borderless: _1,
              centered: _2,
              rippleColor: _3,
              style,
              ...rest
            }) => {
              return (
                <Link
                  {...rest}
                  accessibilityRole="link"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPress={(e: any) => {
                    if (
                      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
                      (e.button == null || e.button === 0) // ignore everything but left clicks
                    ) {
                      e.preventDefault();
                      onPress?.(e);
                    }
                  }}
                  style={[styles.touchable, style]}
                  to={
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    buildLink((route as any).name, (route as any).params) as any
                  }
                />
              );
            }
          : undefined
      }
      safeAreaInsets={insets}
      theme={theme}
    />
  );
}

export default function MaterialBottomTabView(props: Props) {
  return (
    <SafeAreaProviderCompat>
      <MaterialBottomTabViewInner {...props} />
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
  touchable: {
    display: 'flex',
    justifyContent: 'center',
  },
});
