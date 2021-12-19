/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  NotLoggedIn: NavigatorScreenParams<RootTabParamList> | undefined;
  ['Create Account']: NavigatorScreenParams<RootTabParamList> | undefined;
  ['Unverified Account']: NavigatorScreenParams<RootTabParamList> | undefined;
  ['Setting Up Account']: NavigatorScreenParams<RootTabParamList> | undefined;
  Login: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type WhoIsThisFor = 'me' | 'someone_else' | undefined;
export type CreateRequestArgs = Partial<{ for_: WhoIsThisFor }>;

export type RequestExplorerStackParamList = {
  RequestExplorerRoot: NavigatorScreenParams<RootTabParamList> | undefined;
  CreateRequest: CreateRequestArgs;
  PersonDetails: { personNumber: string };
};

export type ThreeLinesMenuStackParamList = {
  ThreeLinesMenuRoot: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type HomeStackScreenProps<
  Screen extends keyof RequestExplorerStackParamList,
> = NativeStackScreenProps<RequestExplorerStackParamList, Screen>;

export type RootTabParamList = {
  RequestExplorer: undefined;
  ThreeLinesMenu: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RootNavigationTypeParameterized<
  T extends keyof RootStackParamList,
> = RootStackScreenProps<T>['navigation'];

export type RootNavigationAllTypes =
  // Idk how else to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null | RootNavigationTypeParameterized<any>;

export type RootNavigationContextType = {
  rootNavigation: RootNavigationAllTypes;
  setRootNavigation: <T extends keyof RootStackParamList>(
    navigation: RootNavigationTypeParameterized<T>,
  ) => void;
};
