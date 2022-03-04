import * as React from 'react';
import { Image } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import CardButtonRow from 'src/client/components/CardButtonRow';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';
import getURL from 'src/client/host/host';
import FeedbackCard from 'src/client/menu/cards/FeedbackCard';
import SupportAppCard from 'src/client/menu/cards/SupportAppCard';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import useHandleViewer from 'src/client/viewer/useHandleViewer';

export default function NotLoggedInScreen({
  navigation,
}: RootStackScreenProps<'NotLoggedIn'>): JSX.Element {
  useHandleViewer(navigation, 'NotLoggedIn', {
    loggedIn: async (_, goToMain) => goToMain(),
  });
  return (
    <ScrollableScreen
      configs={[
        singleElement({
          key: 'welcome',
          render: () => (
            <Text style={{ textAlign: 'center' }}>
              Welcome to Dandelion Community Aid
            </Text>
          ),
        }),
        singleElement({
          key: 'create-account',
          render: () => (
            <CardButtonRow
              buttons={[
                {
                  onPress: () => {
                    navigation.push('Create Account');
                  },
                  text: 'Create new account',
                },
              ]}
            />
          ),
        }),
        singleElement({
          key: 'login',
          render: () => (
            <CardButtonRow
              buttons={[
                {
                  onPress: () => {
                    navigation.push('Login');
                  },
                  text: 'Login to existing account',
                },
              ]}
            />
          ),
        }),
        singleElement({
          key: 'description',
          render: () => (
            <Paragraph style={{ textAlign: 'center' }}>
              Dandelion helps you collaborate on supporting people.
            </Paragraph>
          ),
        }),
        singleElement({
          key: 'SupportAppCard',
          render: () => <SupportAppCard />,
        }),
        singleElement({
          key: 'FeedbackCard',
          render: () => <FeedbackCard />,
        }),
        singleElement({
          key: 'Preview',
          render: () => (
            <StyledCard>
              <Card.Title title="Preview" />
              <Paragraph style={{ textAlign: 'center' }}>
                If you're not on the app yet, scroll down to see what we're
                building.
              </Paragraph>
              <View style={{ maxWidth: 400 }}>
                <Image
                  resizeMode="contain"
                  source={{ uri: getURL('images/request-list-demo.png') }}
                  style={{ height: 710, maxWidth: 400 }}
                />
              </View>
              <View style={{ maxWidth: 400 }}>
                <Image
                  resizeMode="contain"
                  source={{ uri: getURL('images/record-request-demo.png') }}
                  style={{ height: 812, maxWidth: 400 }}
                />
              </View>
            </StyledCard>
          ),
        }),
      ]}
    />
  );
}
