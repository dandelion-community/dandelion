import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TOKEN_URL_PARAM from 'src/shared/urls/TOKEN_URL_PARAM';

export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  NotLoggedIn: NavigatorScreenParams<RootTabParamList> | undefined;
  ['Create Account']: NavigatorScreenParams<RootTabParamList> | undefined;
  ResetPassword: { [TOKEN_URL_PARAM]: string };
  ['Unverified Account']: NavigatorScreenParams<RootTabParamList> | undefined;
  ['Setting Up Account']: NavigatorScreenParams<RootTabParamList> | undefined;
  Login: { message?: string; email?: string };
  Modal: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: NavigatorScreenParams<RootTabParamList> | undefined;
  ['Record Request']: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type WhoIsThisFor = 'me' | 'someone_else' | undefined;
export type CreateRequestArgs = Partial<{ for_: WhoIsThisFor }>;

export type RequestExplorerStackParamList = {
  RequestExplorer: { f?: string };
  AidRequestDetail: { id: string };
  AidRequestNotificationSettings: { id: string };
};

export type RequestExplorerStackScreenProps<
  Screen extends keyof RequestExplorerStackParamList,
> = NativeStackScreenProps<RequestExplorerStackParamList, Screen>;

export type MenuStackParamList = {
  Menu: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type CreateRequestStackParamList = {
  CreateRequest: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootTabParamList = {
  RequestExplorerTabStackContainer: undefined;
  CreateRequestTabStackContainer: undefined;
  MenuTabStackContainer: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RootNavigationTypeParameterized<
  T extends keyof RootStackParamList,
> = RootStackScreenProps<T>['navigation'];

export type RequestExplorerNavigationTypeParameterized<
  T extends keyof RequestExplorerStackParamList,
> = RequestExplorerStackScreenProps<T>['navigation'];

export type RootNavigationAllTypes =
  // Idk how else to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null | RootNavigationTypeParameterized<any>;

export type RequestExplorerNavigationAllTypes =
  // Idk how else to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null | RequestExplorerNavigationTypeParameterized<any>;
