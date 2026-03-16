import type { PropsWithChildren } from 'react';

export default function LayoutContent({ children }: PropsWithChildren) {
  return <div className="relative grow my-0 overflow-hidden">{children}</div>;
}
