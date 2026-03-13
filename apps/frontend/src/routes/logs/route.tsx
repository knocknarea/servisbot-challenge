import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/logs')({
  component: Index,
});

function Index() {
  return <Outlet></Outlet>;
}
