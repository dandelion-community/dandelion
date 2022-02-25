/**
 * This file is mostly copied from react-native-paper
 * https://github.com/callstack/react-native-paper/blob/main/src/components/BottomNavigation/BottomNavigation.tsx
 * 
 * Meaningfully modified portions are enclosed with // {MODIFIED} and // {END MODIFIED}
 * 
 * I know forking is a thing but I don't really know how to do it and don't want to slow myself down by learning :p
 * 
 * react-native-paper's license is as follows:
 * 
MIT License
Copyright (c) 2017 Callstack
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Animated,
  Dimensions,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import {
  Colors,
  FAB,
  Surface,
  Text,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import getURL from 'src/client/host/host';
import BottomNavigationRouteScreen from './BottomNavigationRouteScreen';
import Icon from './Icon';
import useIsKeyboardShown from './useIsKeyboardShown';
const { black, white } = Colors;

function useLazyRef<T>(callback: () => T) {
  const lazyRef = React.useRef<T | undefined>();

  if (lazyRef.current === undefined) {
    lazyRef.current = callback();
  }

  return lazyRef as React.MutableRefObject<T>;
}

function useAnimatedValue(initialValue: number) {
  const { current } = useLazyRef(() => new Animated.Value(initialValue));

  return current;
}

function useAnimatedValueArray(initialValues: number[]) {
  const refs = React.useRef<Animated.Value[]>([]);

  refs.current.length = initialValues.length;
  initialValues.forEach((initialValue, i) => {
    refs.current[i] = refs.current[i] ?? new Animated.Value(initialValue);
  });

  return refs.current;
}

function useLayout() {
  const [layout, setLayout] = React.useState<{
    height: number;
    width: number;
    measured: boolean;
  }>({ height: 0, measured: false, width: 0 });

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { height, width } = e.nativeEvent.layout;

      if (height === layout.height && width === layout.width) {
        return;
      }

      setLayout({
        height,
        measured: true,
        width,
      });
    },
    [layout.height, layout.width],
  );

  return [layout, onLayout] as const;
}

type Route = {
  key: string;
  title?: string;
  icon?: IconSource;
  badge?: string | number | boolean;
  color?: string;
  accessibilityLabel?: string;
  testID?: string;
};

type NavigationState = {
  index: number;
  routes: Route[];
};

type TabPressEvent = {
  defaultPrevented: boolean;
  preventDefault(): void;
};

type TouchableProps = TouchableWithoutFeedbackProps & {
  key: string;
  route: Route;
  children: React.ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: string;
};

type Props = {
  /**
   * Whether the shifting style is used, the active tab icon shifts up to show the label and the inactive tabs won't have a label.
   *
   * By default, this is `true` when you have more than 3 tabs.
   * Pass `shifting={false}` to explicitly disable this animation, or `shifting={true}` to always use this animation.
   */
  shifting?: boolean;
  /**
   * Whether to show labels in tabs. When `false`, only icons will be displayed.
   */
  labeled?: boolean;
  /**
   * State for the bottom navigation. The state should contain the following properties:
   *
   * - `index`: a number representing the index of the active route in the `routes` array
   * - `routes`: an array containing a list of route objects used for rendering the tabs
   *
   * Each route object should contain the following properties:
   *
   * - `key`: a unique key to identify the route (required)
   * - `title`: title of the route to use as the tab label
   * - `icon`: icon to use as the tab icon, can be a string, an image source or a react component
   * - `color`: color to use as background color for shifting bottom navigation
   * - `badge`: badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
   * - `accessibilityLabel`: accessibility label for the tab button
   * - `testID`: test id for the tab button
   *
   * Example:
   *
   * ```js
   * {
   *   index: 1,
   *   routes: [
   *     { key: 'music', title: 'Music', icon: 'queue-music', color: '#3F51B5' },
   *     { key: 'albums', title: 'Albums', icon: 'album', color: '#009688' },
   *     { key: 'recents', title: 'Recents', icon: 'history', color: '#795548' },
   *     { key: 'purchased', title: 'Purchased', icon: 'shopping-cart', color: '#607D8B' },
   *   ]
   * }
   * ```
   *
   * `BottomNavigation` is a controlled component, which means the `index` needs to be updated via the `onIndexChange` callback.
   */
  navigationState: NavigationState;
  /**
   * Callback which is called on tab change, receives the index of the new tab as argument.
   * The navigation state needs to be updated when it's called, otherwise the change is dropped.
   */
  onIndexChange: (index: number) => void;
  /**
   * Callback which returns a react element to render as the page for the tab. Receives an object containing the route as the argument:
   *
   * ```js
   * renderScene = ({ route, jumpTo }) => {
   *   switch (route.key) {
   *     case 'music':
   *       return <MusicRoute jumpTo={jumpTo} />;
   *     case 'albums':
   *       return <AlbumsRoute jumpTo={jumpTo} />;
   *   }
   * }
   * ```
   *
   * Pages are lazily rendered, which means that a page will be rendered the first time you navigate to it.
   * After initial render, all the pages stay rendered to preserve their state.
   *
   * You need to make sure that your individual routes implement a `shouldComponentUpdate` to improve the performance.
   * To make it easier to specify the components, you can use the `SceneMap` helper:
   *
   * ```js
   * renderScene = BottomNavigation.SceneMap({
   *   music: MusicRoute,
   *   albums: AlbumsRoute,
   * });
   * ```
   *
   * Specifying the components this way is easier and takes care of implementing a `shouldComponentUpdate` method.
   * Each component will receive the current route and a `jumpTo` method as it's props.
   * The `jumpTo` method can be used to navigate to other tabs programmatically:
   *
   * ```js
   * this.props.jumpTo('albums')
   * ```
   */
  renderScene: (props: {
    route: Route;
    jumpTo: (key: string) => void;
  }) => React.ReactNode | null;
  /**
   * Callback which returns a React Element to be used as tab icon.
   */
  renderIcon?: (props: {
    route: Route;
    focused: boolean;
    color: string;
  }) => React.ReactNode;
  /**
   * Callback which React Element to be used as tab label.
   */
  renderLabel?: (props: {
    route: Route;
    focused: boolean;
    color: string;
  }) => React.ReactNode;
  /**
   * Callback which returns a React element to be used as the touchable for the tab item.
   * Renders a `TouchableRipple` on Android and `TouchableWithoutFeedback` with `View` on iOS.
   */
  renderTouchable?: (props: TouchableProps) => React.ReactNode;
  /**
   * Get label text for the tab, uses `route.title` by default. Use `renderLabel` to replace label component.
   */
  getLabelText?: (props: { route: Route }) => string | undefined;
  /**
   * Get accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * Uses `route.accessibilityLabel` by default.
   */
  getAccessibilityLabel?: (props: { route: Route }) => string | undefined;
  /**
   * Get the id to locate this tab button in tests, uses `route.testID` by default.
   */
  getTestID?: (props: { route: Route }) => string | undefined;
  /**
   * Get badge for the tab, uses `route.badge` by default.
   */
  getBadge?: (props: { route: Route }) => boolean | number | string | undefined;
  /**
   * Get color for the tab, uses `route.color` by default.
   */
  getColor?: (props: { route: Route }) => string | undefined;
  /**
   * Function to execute on tab press. It receives the route for the pressed tab, useful for things like scroll to top.
   */
  onTabPress?: (props: { route: Route } & TabPressEvent) => void;
  /**
   * Custom color for icon and label in the active tab.
   */
  activeColor?: string;
  /**
   * Custom color for icon and label in the inactive tab.
   */
  inactiveColor?: string;
  /**
   * Whether animation is enabled for scenes transitions in `shifting` mode.
   * By default, the scenes cross-fade during tab change when `shifting` is enabled.
   * Specify `sceneAnimationEnabled` as `false` to disable the animation.
   */
  sceneAnimationEnabled?: boolean;
  /**
   * Whether the bottom navigation bar is hidden when keyboard is shown.
   * On Android, this works best when [`windowSoftInputMode`](https://developer.android.com/guide/topics/manifest/activity-element#wsoft) is set to `adjustResize`.
   */
  keyboardHidesNavigationBar?: boolean;
  /**
   * Safe area insets for the tab bar. This can be used to avoid elements like the navigation bar on Android and bottom safe area on iOS.
   * The bottom insets for iOS is added by default. You can override the behavior with this option.
   */
  safeAreaInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /**
   * Style for the bottom navigation bar.  You can pass a custom background color here:
   *
   * ```js
   * barStyle={{ backgroundColor: '#694fad' }}
   * ```
   */
  barStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;

  // {MODIFIED}
  onFABPress: () => void;
  // {END MODIFIED}
};

const MIN_RIPPLE_SCALE = 0.001; // Minimum scale is not 0 due to bug with animation
const MIN_TAB_WIDTH = 96;
const MAX_TAB_WIDTH = 168;
const BAR_HEIGHT = 56;
const BOTTOM_INSET = getBottomSpace();

const Touchable = ({
  route: _0,
  style,
  children,
  borderless,
  centered,
  rippleColor,
  ...rest
}: TouchableProps) =>
  TouchableRipple.supported ? (
    <TouchableRipple
      {...rest}
      borderless={borderless}
      centered={centered}
      disabled={rest.disabled || undefined}
      rippleColor={rippleColor}
      style={style}
    >
      {children}
    </TouchableRipple>
  ) : (
    <TouchableWithoutFeedback {...rest}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SceneComponent = React.memo(({ component, ...rest }: any) =>
  React.createElement(component, rest),
);

/**
 * Bottom navigation provides quick navigation between top-level views of an app with a bottom navigation bar.
 * It is primarily designed for use on mobile.
 *
 * For integration with React Navigation, you can use [react-navigation-material-bottom-tabs](https://github.com/react-navigation/react-navigation/tree/main/packages/material-bottom-tabs) and consult [createMaterialBottomTabNavigator](https://reactnavigation.org/docs/material-bottom-tab-navigator/) documentation.
 *
 * By default Bottom navigation uses primary color as a background, in dark theme with `adaptive` mode it will use surface colour instead.
 * See [Dark Theme](https://callstack.github.io/react-native-paper/theming.html#dark-theme) for more information.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/bottom-navigation.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { BottomNavigation, Text } from 'react-native-paper';
 *
 * const MusicRoute = () => <Text>Music</Text>;
 *
 * const AlbumsRoute = () => <Text>Albums</Text>;
 *
 * const RecentsRoute = () => <Text>Recents</Text>;
 *
 * const MyComponent = () => {
 *   const [index, setIndex] = React.useState(0);
 *   const [routes] = React.useState([
 *     { key: 'music', title: 'Music', icon: 'queue-music' },
 *     { key: 'albums', title: 'Albums', icon: 'album' },
 *     { key: 'recents', title: 'Recents', icon: 'history' },
 *   ]);
 *
 *   const renderScene = BottomNavigation.SceneMap({
 *     music: MusicRoute,
 *     albums: AlbumsRoute,
 *     recents: RecentsRoute,
 *   });
 *
 *   return (
 *     <BottomNavigation
 *       navigationState={{ index, routes }}
 *       onIndexChange={setIndex}
 *       renderScene={renderScene}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const BottomNavigation = ({
  navigationState,
  renderScene,
  renderIcon,
  renderLabel,
  renderTouchable = (props: TouchableProps) => <Touchable {...props} />,
  getLabelText = ({ route }: { route: Route }) => route.title,
  getBadge = ({ route }: { route: Route }) => route.badge,
  getColor = ({ route }: { route: Route }) => route.color,
  getAccessibilityLabel = ({ route }: { route: Route }) =>
    route.accessibilityLabel,
  getTestID = ({ route }: { route: Route }) => route.testID,
  activeColor,
  inactiveColor,
  keyboardHidesNavigationBar = true,
  barStyle,
  labeled = true,
  style,
  theme,
  sceneAnimationEnabled = false,
  onTabPress,
  onIndexChange,
  shifting = navigationState.routes.length > 3,
  safeAreaInsets,
  onFABPress,
}: Props) => {
  const { scale } = theme.animation;

  const focusedKey = navigationState.routes[navigationState.index].key;

  /**
   * Visibility of the navigation bar, visible state is 1 and invisible is 0.
   */
  const visibleAnim = useAnimatedValue(1);

  /**
   * Active state of individual tab items, active state is 1 and inactive state is 0.
   */
  const tabsAnims = useAnimatedValueArray(
    navigationState.routes.map(
      // focused === 1, unfocused === 0
      (_, i) => (i === navigationState.index ? 1 : 0),
    ),
  );

  /**
   * The top offset for each tab item to position it offscreen.
   * Placing items offscreen helps to save memory usage for inactive screens with removeClippedSubviews.
   * We use animated values for this to prevent unnecessary re-renders.
   */
  const offsetsAnims = useAnimatedValueArray(
    navigationState.routes.map(
      // offscreen === 1, normal === 0
      (_, i) => (i === navigationState.index ? 0 : 1),
    ),
  );

  /**
   * Index of the currently active tab. Used for setting the background color.
   * We don't use the color as an animated value directly, because `setValue` seems to be buggy with colors.
   */
  const indexAnim = useAnimatedValue(navigationState.index);

  /**
   * Animation for the background color ripple, used to determine it's scale and opacity.
   */
  const rippleAnim = useAnimatedValue(MIN_RIPPLE_SCALE);

  /**
   * Layout of the navigation bar. The width is used to determine the size and position of the ripple.
   */
  const [layout, onLayout] = useLayout();

  /**
   * List of loaded tabs, tabs will be loaded when navigated to.
   */
  const [loaded, setLoaded] = React.useState<string[]>([focusedKey]);

  if (!loaded.includes(focusedKey)) {
    // Set the current tab to be loaded if it was not loaded before
    setLoaded((loaded) => [...loaded, focusedKey]);
  }

  /**
   * Track whether the keyboard is visible to show and hide the navigation bar.
   */
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  const handleKeyboardShow = React.useCallback(() => {
    setKeyboardVisible(true);
    Animated.timing(visibleAnim, {
      duration: 150 * scale,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [scale, visibleAnim]);

  const handleKeyboardHide = React.useCallback(() => {
    Animated.timing(visibleAnim, {
      duration: 100 * scale,
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      setKeyboardVisible(false);
    });
  }, [scale, visibleAnim]);

  const animateToIndex = React.useCallback(
    (index: number) => {
      // Reset the ripple to avoid glitch if it's currently animating
      rippleAnim.setValue(MIN_RIPPLE_SCALE);

      Animated.parallel([
        Animated.timing(rippleAnim, {
          duration: shifting ? 400 * scale : 0,
          toValue: 1,
          useNativeDriver: true,
        }),
        ...navigationState.routes.map((_, i) =>
          Animated.timing(tabsAnims[i], {
            duration: shifting ? 150 * scale : 0,
            toValue: i === index ? 1 : 0,
            useNativeDriver: true,
          }),
        ),
      ]).start(({ finished }) => {
        // Workaround a bug in native animations where this is reset after first animation
        tabsAnims.map((tab, i) => tab.setValue(i === index ? 1 : 0));

        // Update the index to change bar's background color and then hide the ripple
        indexAnim.setValue(index);
        rippleAnim.setValue(MIN_RIPPLE_SCALE);

        if (finished) {
          // Position all inactive screens offscreen to save memory usage
          // Only do it when animation has finished to avoid glitches mid-transition if switching fast
          offsetsAnims.forEach((offset, i) => {
            if (i === index) {
              offset.setValue(0);
            } else {
              offset.setValue(1);
            }
          });
        }
      });
    },
    [
      indexAnim,
      shifting,
      navigationState.routes,
      offsetsAnims,
      rippleAnim,
      scale,
      tabsAnims,
    ],
  );

  React.useEffect(() => {
    // Workaround for native animated bug in react-native@^0.57
    // Context: https://github.com/callstack/react-native-paper/pull/637
    animateToIndex(navigationState.index);
  }, []);

  useIsKeyboardShown({
    onHide: handleKeyboardHide,
    onShow: handleKeyboardShow,
  });

  const prevNavigationState = React.useRef<NavigationState>();

  React.useEffect(() => {
    // Reset offsets of previous and current tabs before animation
    offsetsAnims.forEach((offset, i) => {
      if (
        i === navigationState.index ||
        i === prevNavigationState.current?.index
      ) {
        offset.setValue(0);
      }
    });

    animateToIndex(navigationState.index);
  }, [navigationState.index, animateToIndex, offsetsAnims]);

  const handleTabPress = (index: number) => {
    const event = {
      defaultPrevented: false,
      preventDefault: () => {
        event.defaultPrevented = true;
      },
      route: navigationState.routes[index],
    };

    onTabPress?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (index !== navigationState.index) {
      onIndexChange(index);
    }
  };

  const jumpTo = React.useCallback(
    (key: string) => {
      const index = navigationState.routes.findIndex(
        (route) => route.key === key,
      );

      onIndexChange(index);
    },
    [navigationState.routes, onIndexChange],
  );

  const { routes } = navigationState;
  const { colors, dark: isDarkTheme } = theme;

  const { backgroundColor }: ViewStyle = StyleSheet.flatten(barStyle) || {};

  const isDark = isDarkTheme;

  const textColor = isDark ? white : black;
  const activeTintColor =
    typeof activeColor !== 'undefined' ? activeColor : textColor;
  const inactiveTintColor = inactiveColor ?? 'green';

  const touchColor = activeTintColor;

  const maxTabWidth = routes.length > 3 ? MIN_TAB_WIDTH : MAX_TAB_WIDTH;
  const maxTabBarWidth = maxTabWidth * routes.length;

  const tabBarWidth = Math.min(layout.width, maxTabBarWidth);
  const tabWidth = tabBarWidth / routes.length;

  const rippleSize = layout.width / 4;

  const insets = {
    bottom: safeAreaInsets?.bottom ?? BOTTOM_INSET,
    left: safeAreaInsets?.left ?? 0,
    right: safeAreaInsets?.right ?? 0,
  };

  return (
    <View
      // {MODIFIED} Set background color to transparent
      style={[styles.container, style, { backgroundColor: 'rgba(0,0,0,0)' }]}
      // {END MODIFIED}
    >
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        {routes.map((route, index) => {
          if (!loaded.includes(route.key)) {
            // Don't render a screen if we've never navigated to it
            return null;
          }

          const focused = navigationState.index === index;

          const opacity = sceneAnimationEnabled
            ? tabsAnims[index]
            : focused
            ? 1
            : 0;

          return (
            <BottomNavigationRouteScreen
              accessibilityElementsHidden={!focused}
              collapsable={false}
              importantForAccessibility={
                focused ? 'auto' : 'no-hide-descendants'
              }
              index={index}
              key={route.key}
              pointerEvents={focused ? 'auto' : 'none'}
              removeClippedSubviews={
                // On iOS, set removeClippedSubviews to true only when not focused
                // This is an workaround for a bug where the clipped view never re-appears
                Platform.OS === 'ios' ? navigationState.index !== index : true
              }
              style={[StyleSheet.absoluteFill, { opacity }]}
              visibility={opacity}
            >
              <Animated.View
                style={[
                  styles.content,
                  {
                    height: Dimensions.get('window').height,
                    position: 'absolute',
                    top: 0,
                    width: Dimensions.get('window').width,
                  },
                ]}
              >
                {renderScene({ jumpTo, route })}
              </Animated.View>
            </BottomNavigationRouteScreen>
          );
        })}
      </View>
      <Surface
        onLayout={onLayout}
        pointerEvents={
          layout.measured
            ? keyboardHidesNavigationBar && keyboardVisible
              ? 'none'
              : 'auto'
            : 'none'
        }
        style={
          [
            styles.bar,
            keyboardHidesNavigationBar
              ? {
                  // Absolutely position the navigation bar so that the content is below it
                  // This is needed to avoid gap at bottom when the navigation bar is hidden
                  position: keyboardVisible ? 'absolute' : null,

                  // When the keyboard is shown, slide down the navigation bar
                  transform: [
                    {
                      translateY: visibleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layout.height, 0],
                      }),
                    },
                  ],
                }
              : null,
            barStyle,
            // {MODIFIED} Set background color to transparent
            { backgroundColor: 'rgba(0,0,0,0)' },
            // {END MODIFIED}
          ] as StyleProp<ViewStyle>
        }
      >
        <Animated.View
          /* // {MODIFIED} Set background color to transparent */
          style={[styles.barContent, { backgroundColor: 'rgba(0,0,0,0)' }]}
          /* // {END MODIFIED} */
        >
          {/* // {MODIFIED} Add spacer with solid background for bottom inset */}
          <View
            style={{
              backgroundColor,
              bottom: 0,
              height: insets.bottom,
              position: 'absolute',
              width: '100%',
            }}
          />
          {/* // {END MODIFIED} */}
          <View
            accessibilityRole={'tablist'}
            style={[
              styles.items,
              {
                marginBottom: insets.bottom,
                marginHorizontal: Math.max(insets.left, insets.right),
                maxWidth: maxTabBarWidth,
              },
            ]}
          >
            {shifting ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.ripple,
                  {
                    backgroundColor: getColor({
                      route: routes[navigationState.index],
                    }),

                    borderRadius: rippleSize / 2,

                    height: rippleSize,

                    left:
                      tabWidth * (navigationState.index + 0.5) - rippleSize / 2,

                    opacity: rippleAnim.interpolate({
                      inputRange: [0, MIN_RIPPLE_SCALE, 0.3, 1],
                      outputRange: [0, 0, 1, 1],
                    }),
                    // Since we have a single ripple, we have to reposition it so that it appears to expand from active tab.
                    // We need to move it from the top to center of the navigation bar and from the left to the active tab.
                    top: (BAR_HEIGHT - rippleSize) / 2,
                    transform: [
                      {
                        // Scale to twice the size  to ensure it covers the whole navigation bar
                        scale: rippleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 8],
                        }),
                      },
                    ],
                    width: rippleSize,
                  },
                ]}
              />
            ) : null}
            {routes.map((route, index) => {
              const focused = navigationState.index === index;
              const active = tabsAnims[index];

              // Scale the label up
              const scale =
                labeled && shifting
                  ? active.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  : 1;

              // Move down the icon to account for no-label in shifting and smaller label in non-shifting.
              const translateY = labeled
                ? shifting
                  ? active.interpolate({
                      inputRange: [0, 1],
                      outputRange: [7, 0],
                    })
                  : 0
                : 7;

              // We render the active icon and label on top of inactive ones and cross-fade them on change.
              // This trick gives the illusion that we are animating between active and inactive colors.
              // This is to ensure that we can use native driver, as colors cannot be animated with native driver.
              const activeOpacity = active;
              const inactiveOpacity = active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              });

              const badge = getBadge({ route });

              // {MODIFIED}
              const isFAB =
                (route as unknown as { name: string }).name ===
                'CreateRequestTabStackContainer';

              if (isFAB) {
                // We can customize this. This is just a preference for how much space we want
                const spaceBetweenFabAndBottomBar = 5;

                // These are determined by react-native-paper
                const fabDiameter = 56;
                const bottomBarHeight = 54;

                // Enough to cover the whole space where the tab button would be
                const borderWidth = Dimensions.get('window').width / 3;

                const diameter =
                  borderWidth * 2 +
                  fabDiameter +
                  spaceBetweenFabAndBottomBar * 2;
                const radius = diameter / 2;

                return (
                  <View
                    key="fab"
                    pointerEvents="none"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0)',
                      flexBasis: 1,
                      flexGrow: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'rgba(255, 0, 0, 0)',
                        borderColor: backgroundColor,
                        borderRadius: radius,
                        borderWidth,
                        bottom: -radius + bottomBarHeight,
                        height: diameter,
                        left: '50%',
                        marginLeft: -radius,
                        position: 'absolute',
                        width: diameter,
                      }}
                    />
                  </View>
                );
              }
              // {END MODIFIED}

              return renderTouchable({
                // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
                accessibilityComponentType: 'button',
                accessibilityLabel: getAccessibilityLabel({ route }),
                accessibilityRole: Platform.OS === 'ios' ? 'button' : 'tab',
                accessibilityState: { selected: focused },
                accessibilityTraits: focused
                  ? ['button', 'selected']
                  : 'button',

                borderless: true,

                centered: true,

                children: (
                  <View pointerEvents="none">
                    <Animated.View
                      style={[
                        styles.iconContainer,
                        { transform: [{ translateY }] },
                      ]}
                    >
                      <Animated.View
                        style={[styles.iconWrapper, { opacity: activeOpacity }]}
                      >
                        {renderIcon ? (
                          renderIcon({
                            color: activeTintColor,
                            focused: true,
                            route,
                          })
                        ) : (
                          <Icon
                            color={activeTintColor}
                            size={24}
                            source={route.icon as IconSource}
                          />
                        )}
                      </Animated.View>
                      <Animated.View
                        style={[
                          styles.iconWrapper,
                          { opacity: inactiveOpacity },
                        ]}
                      >
                        {renderIcon ? (
                          renderIcon({
                            color: inactiveTintColor,
                            focused: false,
                            route,
                          })
                        ) : (
                          <Icon
                            color={inactiveTintColor}
                            size={24}
                            source={route.icon as IconSource}
                          />
                        )}
                      </Animated.View>
                      <View
                        style={[
                          styles.badgeContainer,
                          {
                            right:
                              (badge != null && typeof badge !== 'boolean'
                                ? String(badge).length * -2
                                : 0) - 2,
                          },
                        ]}
                      ></View>
                    </Animated.View>
                    {labeled ? (
                      <Animated.View
                        style={[
                          styles.labelContainer,
                          { transform: [{ scale }] },
                        ]}
                      >
                        <Animated.View
                          style={[
                            styles.labelWrapper,
                            { opacity: activeOpacity },
                          ]}
                        >
                          {renderLabel ? (
                            renderLabel({
                              color: activeTintColor,
                              focused: true,
                              route,
                            })
                          ) : (
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore Idk what's wrong here
                            <Text
                              style={[styles.label, { color: activeTintColor }]}
                              theme={theme}
                            >
                              {getLabelText({ route })}
                            </Text>
                          )}
                        </Animated.View>
                        {shifting ? null : (
                          <Animated.View
                            style={[
                              styles.labelWrapper,
                              { opacity: inactiveOpacity },
                            ]}
                          >
                            {renderLabel ? (
                              renderLabel({
                                color: inactiveTintColor,
                                focused: false,
                                route,
                              })
                            ) : (
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore Idk what's wrong here
                              <Text
                                selectable={false}
                                style={[
                                  styles.label,
                                  { color: inactiveTintColor },
                                ]}
                              >
                                {getLabelText({ route })}
                              </Text>
                            )}
                          </Animated.View>
                        )}
                      </Animated.View>
                    ) : (
                      <View style={styles.labelContainer} />
                    )}
                  </View>
                ),

                key: route.key,

                onPress: () => {
                  if (isFAB) {
                    return;
                  }
                  handleTabPress(index);
                },

                rippleColor: touchColor,

                route,
                style: {
                  backgroundColor,
                  flex: 1,
                  // {MODIFIED}
                  opacity: isFAB ? 0 : 1,
                  // {END MODIFIED}
                  // Top padding is 6 and bottom padding is 10
                  // The extra 4dp bottom padding is offset by label's height
                  paddingVertical: 6,
                },
                testID: getTestID({ route }),
              });
            })}
          </View>
        </Animated.View>
      </Surface>
      {/* // {MODIFIED} */}
      {/* eslint-disable-next-line react/jsx-pascal-case */}
      <FAB
        icon={{ uri: getURL('icons/light/plus.png') }}
        onPress={onFABPress}
        style={{
          bottom: keyboardVisible ? -100 : 0,
          left: '50%',
          marginBottom: 25 + insets.bottom,
          marginLeft: -28,
          position: 'absolute',
        }}
      />
      {/* // {END MODIFIED} */}
    </View>
  );
};

/**
 * Function which takes a map of route keys to components.
 * Pure components are used to minimize re-rendering of the pages.
 * This drastically improves the animation performance.
 */
BottomNavigation.SceneMap = (scenes: {
  [key: string]: React.ComponentType<{
    route: Route;
    jumpTo: (key: string) => void;
  }>;
}) => {
  return ({
    route,
    jumpTo,
  }: {
    route: Route;
    jumpTo: (key: string) => void;
  }) => (
    <SceneComponent
      component={scenes[route.key ? route.key : '']}
      jumpTo={jumpTo}
      key={route.key}
      route={route}
    />
  );
};

export default withTheme(BottomNavigation);

const styles = StyleSheet.create({
  badgeContainer: {
    left: 0,
    position: 'absolute',
    top: -2,
  },
  bar: {
    bottom: 0,
    elevation: 4,
    left: 0,
    right: 0,
  },
  barContent: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignSelf: 'center',
    height: 24,
    marginHorizontal: 12,
    marginTop: 2,
    width: 24,
  },
  iconWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  item: {
    flex: 1,
    // Top padding is 6 and bottom padding is 10
    // The extra 4dp bottom padding is offset by label's height
    paddingVertical: 6,
  },

  items: {
    flexDirection: 'row',
    ...(Platform.OS === 'web'
      ? {
          width: '100%',
        }
      : null),
  },

  label: {
    backgroundColor: 'transparent',
    fontSize: 12,
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? {
          alignSelf: 'center',
          whiteSpace: 'nowrap',
        }
      : null),
  },

  labelContainer: {
    height: 16,
    paddingBottom: 2,
  },

  labelWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  ripple: {
    position: 'absolute',
  },
});
