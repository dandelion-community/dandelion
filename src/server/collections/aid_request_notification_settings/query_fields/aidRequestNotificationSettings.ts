import { schemaComposer } from 'graphql-compose';
import analytics from 'src/server/analytics';
import { AidRequestNotificationSettingsTypeForGraphQL } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModelTypes';
import getAidRequestNotificationSettings from 'src/server/collections/aid_request_notification_settings/helpers/getAidRequestNotificationSettings';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import graphqlifyAidRequestNotificationSettings from '../helpers/graphqlifyAidRequestNotificationSettings';

type Args = {
  aidRequestID: string;
};

const aidRequests = schemaComposer.createResolver<Express.User, Args>({
  args: {
    aidRequestID: 'String!',
  },
  kind: 'query',
  name: 'aidRequestNotificationSettings',
  resolve: async ({
    args,
    context: request,
  }): Promise<AidRequestNotificationSettingsTypeForGraphQL> => {
    const { aidRequestID } = args;
    const user = assertLoggedIn(request, 'aidRequest');
    const notificationSettings = await getAidRequestNotificationSettings(
      user,
      aidRequestID,
    );

    analytics.track({
      event: 'Loaded Aid Request Notification Settings',
      properties: {
        aidRequestID,
      },
      user,
    });

    return graphqlifyAidRequestNotificationSettings(user, notificationSettings);
  },
  type: 'AidRequestNotificationSettings!',
});

export default aidRequests;
