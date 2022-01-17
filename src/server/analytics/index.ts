import Analytics from 'analytics-node';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const segmentAnalytics = new Analytics(
  process.env.SEGMENT_ANALYTICS_WRITE_KEY as string,
);

const mongoAnalytics = {
  track: ({ user, event, properties }: Message): void => {
    mongoose.connection.db.collection('analytics').insertOne({
      event,
      ...(properties ?? {}),
      timestamp: new Date(),
      userDisplayName: user.displayName,
      userId: user._id.toString(),
      username: user.username,
    });
  },
};

type Message = {
  user: Express.User;
  event: string;
  properties?: Record<string, string>;
};

const analytics = {
  identify: (...args: Parameters<typeof segmentAnalytics['identify']>) =>
    segmentAnalytics.identify(...args),
  track: (message: Message): void => {
    const { event, properties, user } = message;
    segmentAnalytics.track({
      event,
      properties: {
        ...properties,
        usernameProp: user.username,
      },
      userId: user._id.toString(),
    });
    mongoAnalytics.track(message);
  },
};

export default analytics;
