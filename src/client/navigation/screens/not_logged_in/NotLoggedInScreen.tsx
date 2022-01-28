import * as React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import StyledCard from 'src/client/components/Card';
import CardButtonRow from 'src/client/components/CardButtonRow';
import Text from 'src/client/components/Text';
import View from 'src/client/components/View';
import getURL from 'src/client/graphql/host';
import FeedbackCard from 'src/client/menu/FeedbackCard';
import SupportAppCard from 'src/client/menu/SupportAppCard';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import useHandleViewer from 'src/client/viewer/useHandleViewer';

export default function NotLoggedInScreen({
  navigation,
}: RootStackScreenProps<'NotLoggedIn'>): JSX.Element {
  useSetRootNavigation(navigation);
  useHandleViewer(navigation, 'NotLoggedIn', {
    loggedIn: async (_, goToMain) => goToMain(),
  });
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.inner}>
          <Text style={{ textAlign: 'center' }}>
            Welcome to Dandelion Community Aid
          </Text>
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
          <Paragraph style={{ textAlign: 'center' }}>
            Dandelion helps you collaboratively address the needs of your
            neighbors.
          </Paragraph>
          <SupportAppCard />
          <FeedbackCard />
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'stretch',
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 420,
  },
  text: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});
