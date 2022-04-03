import * as React from 'react';
import { ListRenderItemInfo, SectionList, SectionListData } from 'react-native';
import useViewWidth from 'src/client/components/useViewWidth';
import ErrorBoundary from '../error/ErrorBoundary';
import CenteredOnScreen from '../screen_size/CenteredOnScreen';

export type ScrollableScreenItem = {
  key: string;
  render: () => JSX.Element;
};

export type ScrollableScreenSectionProps =
  SectionListData<ScrollableScreenItem>;

type ExtraProps = Partial<
  Omit<
    SectionList['props'],
    'extraData' | 'keyExtractor' | 'renderItem' | 'sections'
  >
>;

export type SectionRendererData = {
  section: ScrollableScreenSectionProps;
} & ExtraProps;

type Props = {
  configs: SectionRendererData[];
};

export default function ScrollableScreen({ configs }: Props): JSX.Element {
  const viewWidth = useViewWidth();
  const extraData = React.useMemo(
    () => ({
      viewWidth,
    }),
    [viewWidth],
  );
  let extraProps: ExtraProps = {};
  const sections: ScrollableScreenSectionProps[] = [];
  configs.forEach((config: SectionRendererData): void => {
    const { section, ...rest } = config;
    sections.push(section);
    extraProps = { ...extraProps, ...rest };
  });
  return (
    <SectionList
      extraData={extraData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      sections={sections}
      {...extraProps}
    />
  );

  function renderItem({
    item,
  }: ListRenderItemInfo<ScrollableScreenItem>): React.ReactElement {
    const { render } = item;
    return (
      <CenteredOnScreen>
        <ErrorBoundary>{render()}</ErrorBoundary>
      </CenteredOnScreen>
    );
  }
}

function keyExtractor({ key }: ScrollableScreenItem): string {
  return key;
}
