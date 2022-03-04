import * as React from 'react';
import {
  ListRenderItemInfo,
  SectionList,
  SectionListData,
  useWindowDimensions,
} from 'react-native';
import useViewWidth from 'src/client/components/useViewWidth';
import View from 'src/client/components/ViewWithBackground';

export type ScrollableScreenItem = {
  key: string;
  render: () => React.ReactElement | null;
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
  const { width: screenWidth } = useWindowDimensions();
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
      <View style={{ alignItems: 'center', width: screenWidth }}>
        <View style={{ width: viewWidth }}>{render()}</View>
      </View>
    );
  }
}

function keyExtractor({ key }: ScrollableScreenItem): string {
  return key;
}
