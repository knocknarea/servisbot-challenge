import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import LayoutContent from '../components/layout-content';
import LayoutFooter from '../components/layout-footer';
import LayoutMenu from '../components/layout-menu';
import { RouterContext } from '../model/router-context';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

export default function Root() {
  return (
    <div className="flex min-h-dvh max-h-dvh flex-col mw-10 mb-0">
      <LayoutMenu></LayoutMenu>
      <LayoutContent>
        {/* Let tanstack router place the contents in here */}
        <Outlet />
      </LayoutContent>
      <LayoutFooter></LayoutFooter>
    </div>
  );
}
