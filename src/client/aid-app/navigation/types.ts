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
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type WhoIsThisFor = 'me' | 'someone_else' | undefined;
export type CreateRequestArgs = Partial<{ for_: WhoIsThisFor }>;

export type HomeStackParamList = {
  HomeRoot: NavigatorScreenParams<RootTabParamList> | undefined;
  CreateRequest: CreateRequestArgs;
  PersonDetails: { personNumber: string };
};

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
