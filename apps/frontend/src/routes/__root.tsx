import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import LayoutContent from "../components/layout-content";
import LayoutFooter from "../components/layout-footer";
import LayoutMenu from "../components/layout-menu";

export const Route = createRootRoute({
  component: Root,
});

// Tanstack Query Client
const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh flex-col mw-10 mb-0">
        <LayoutMenu></LayoutMenu>
        <LayoutContent>
          {/* Let tanstack router place the contents in here */}
          <Outlet />
        </LayoutContent>
        <LayoutFooter></LayoutFooter>
      </div>
    </QueryClientProvider>
  );
}
