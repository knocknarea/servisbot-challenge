import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/bots')({
  component: Bots,
});

export default function Bots() {
  return <Outlet></Outlet>;
}
