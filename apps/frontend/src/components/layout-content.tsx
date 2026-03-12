import type { PropsWithChildren } from 'react';

export default function LayoutContent({ children }: PropsWithChildren) {
  return <div className="grow my-0 overflow-scroll">{children}</div>;
}
