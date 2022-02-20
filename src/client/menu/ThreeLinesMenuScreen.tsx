import * as React from 'react';
import EndOfListSpacer from 'src/client/components/EndOfListSpacer';
import AttributionCard from 'src/client/menu/attribution/AttributionCard';
import DebugInfoCard from 'src/client/menu/debug/DebugInfoCard';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import YourAccountMenuCard from 'src/client/viewer/YourAccountMenuCard';
import ScrollableScreen from '../scrollable_screen/ScrollableScreen';
import singleElement from '../scrollable_screen/singleElement';
import FeedbackCard from './FeedbackCard';
import SupportAppCard from './SupportAppCard';

export default function ThreeLinesMenuScreen(): JSX.Element {
  return (
    <RequireLoggedInScreen>
      <ScrollableScreen
        configs={[
          singleElement({
            key: 'YourAccountMenuCard',
            render: () => <YourAccountMenuCard />,
          }),
          singleElement({
            key: 'FeedbackCard',
            render: () => <FeedbackCard />,
          }),
          singleElement({
            key: 'SupportAppCard',
            render: () => <SupportAppCard />,
          }),
          singleElement({
            key: 'DebugInfoCard',
            render: () => <DebugInfoCard />,
          }),
          singleElement({
            key: 'AttributionCard',
            render: () => <AttributionCard />,
          }),
          singleElement({
            key: 'EndOfListSpacer',
            render: () => <EndOfListSpacer />,
          }),
        ]}
      ></ScrollableScreen>
    </RequireLoggedInScreen>
  );
}
