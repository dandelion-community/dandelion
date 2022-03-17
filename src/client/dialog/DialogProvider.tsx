import * as React from 'react';
import useStore from '../store/useStore';
import DialogStore from './DialogStore';

type Props = {
  children: JSX.Element;
};

export default function DialogProvider({ children }: Props): JSX.Element {
  const { render } = useStore(DialogStore);
  return render == null ? (
    children
  ) : (
    <>
      {children}
      {render()}
    </>
  );
}
