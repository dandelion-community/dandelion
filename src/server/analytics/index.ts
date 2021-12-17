import Analytics from 'analytics-node';
import dotenv from 'dotenv';

dotenv.config();
const analytics = new Analytics(
  process.env.SEGMENT_ANALYTICS_WRITE_KEY as string,
);

export default analytics;
