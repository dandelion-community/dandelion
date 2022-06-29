import Analytics from 'analytics-node';
import mongoose from 'mongoose';
import env from 'src/shared/env/env';
import environmentIsUsingTestDatabase from 'src/shared/env/environmentIsUsingTestDatabase';

const SEGMENT_ANALYTICS_WRITE_KEY = env.SEGMENT_ANALYTICS_WRITE_KEY;
if (!SEGMENT_ANALYTICS_WRITE_KEY) {
  throw new Error(
    'SEGMENT_ANALYTICS_WRITE_KEY environment variable must be provided',
  );
}

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
    if (environmentIsUsingTestDatabase()) {
      console.log('[Event] ' + event);
    }
  },
};

export default analytics;
