import { createFileRoute } from '@tanstack/react-router';
import {
  NavigationArea,
  useNavigationStore,
} from '../../store/navigation-store';

export const Route = createFileRoute('/logs')({
  component: Logs,
});

function Logs() {
  const setActiveArea = useNavigationStore((state) => state.setActiveArea);

  setActiveArea(NavigationArea.LOGS);

  return <div>Logs</div>;
}
