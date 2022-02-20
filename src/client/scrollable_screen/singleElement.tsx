import * as React from 'react';
import { SectionRendererData } from 'src/client/scrollable_screen/ScrollableScreen';

type Props = {
  render: () => React.ReactElement;
  key: string;
};

export default function singleElement({
  render,
  key,
}: Props): SectionRendererData {
  return {
    section: {
      data: [
        {
          key,
          render: render,
        },
      ],
      key,
    },
  };
}
