import * as React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

type Item = {
  key: string;
  render: () => React.ReactElement;
};

export default function StaticScrollableList({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}): JSX.Element {
  const elements = Array.isArray(children) ? children : [children];
  return (
    <FlatList
      data={elements.map((element: React.ReactElement, key: number): Item => {
        return {
          key: key.toString(),
          render: () => element,
        };
      })}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
}

function keyExtractor({ key }: Item): string {
  return key;
}

function renderItem({ item }: ListRenderItemInfo<Item>): React.ReactElement {
  return item.render();
}
