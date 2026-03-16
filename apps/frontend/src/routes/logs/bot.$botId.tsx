import { createFileRoute } from '@tanstack/react-router';
import LogListing from '../../components/data/log-list-component';
import { useBotStore } from '../../store/bot-store';
import {
  NavigationArea,
  useNavigationStore,
} from '../../store/navigation-store';

export const Route = createFileRoute('/logs/bot/$botId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { botId } = Route.useParams();

  const { workerListQuery: query, setWorkerListQuery: setQuery } =
    useBotStore();

  const setActiveArea = useNavigationStore((state) => state.setActiveArea);

  setActiveArea(NavigationArea.LOGS);

  console.log('Bot Log Route Called');
  // Note: dataLength is derived from reduction of the length
  // of the payload of all pages. TanStack infinite query stores
  // each page separately in a list.
  return (
    <LogListing query={query} setQuery={setQuery} botId={botId}></LogListing>
  );
}
