import Analytics from 'analytics-node';
import mongoose from 'mongoose';
import ENVIRONMENT_IS_USING_TEST_DATABASE from 'src/shared/env/ENVIRONMENT_IS_USING_TEST_DATABASE';
import getEnvironmentVariableAndThrowIfNotFound from 'src/shared/env/getEnvironmentVariableAndThrowIfNotFound';

const SEGMENT_ANALYTICS_WRITE_KEY = getEnvironmentVariableAndThrowIfNotFound(
  'SEGMENT_ANALYTICS_WRITE_KEY',
);

const segmentAnalytics = new Analytics(SEGMENT_ANALYTICS_WRITE_KEY);

const mongoAnalytics = {
  track: ({ user, event, properties }: Message): void => {
    mongoose.connection.db.collection('analytics').insertOne({
      event,
      ...(properties ?? {}),
      timestamp: new Date(),
      userCrews: user == null ? '' : user.crews.join(', '),
      userDisplayName: user?.displayName ?? '',
      userId: user == null ? '' : user._id.toString(),
      username: user?.username ?? '',
    });
  },
};

type Message = {
  user: Express.User | null;
  event: string;
  properties?: Record<string, string>;
};

const analytics = {
  identify: (...args: Parameters<typeof segmentAnalytics['identify']>) => {
    segmentAnalytics.identify(...args);
  },
  track: (message: Message): void => {
    const { event, properties, user } = message;
    segmentAnalytics.track({
      event,
      properties: {
        ...properties,
        usernameProp: user?.username ?? '',
      },
      userId: user == null ? 'none' : user._id.toString(),
    });
    mongoAnalytics.track(message);
    if (ENVIRONMENT_IS_USING_TEST_DATABASE) {
      console.log('[Event] ' + event);
    }
  },
};

export default analytics;
