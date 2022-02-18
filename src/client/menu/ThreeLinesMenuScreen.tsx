import * as React from 'react';
import EndOfListSpacer from 'src/client/components/EndOfListSpacer';
import AttributionCard from 'src/client/menu/attribution/AttributionCard';
import DebugInfoCard from 'src/client/menu/debug/DebugInfoCard';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import YourAccountMenuCard from 'src/client/viewer/YourAccountMenuCard';
import ScrollableScreen from '../components/ScrollableScreen';
import FeedbackCard from './FeedbackCard';
import SupportAppCard from './SupportAppCard';

export default function ThreeLinesMenuScreen(): JSX.Element {
  return (
    <RequireLoggedInScreen>
      <ScrollableScreen>
        <YourAccountMenuCard />
        <FeedbackCard />
        <SupportAppCard />
        <DebugInfoCard />
        <AttributionCard />
        <EndOfListSpacer />
      </ScrollableScreen>
    </RequireLoggedInScreen>
  );
}
