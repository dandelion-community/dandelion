import * as React from 'react';
import {
  ListRenderItemInfo,
  SectionList,
  SectionListData,
  StyleSheet,
} from 'react-native';
import StaticScrollableList from 'src/client/components/StaticScrollableList';
import useViewWidth from 'src/client/components/useViewWidth';
import View from 'src/client/components/View';

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
    <View style={styles.container}>
      <StaticScrollableList>
        <View style={{ alignItems: 'center' }}>
          <SectionList
            extraData={extraData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            sections={sections}
            {...extraProps}
          />
        </View>
      </StaticScrollableList>
    </View>
  );

  function keyExtractor({ key }: ScrollableScreenItem): string {
    return key;
  }

  function renderItem({
    item,
  }: ListRenderItemInfo<ScrollableScreenItem>): React.ReactElement {
    const { render } = item;
    return <View style={{ width: viewWidth }}>{render()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});
