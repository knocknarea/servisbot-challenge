import { BotService } from '@servisbot/model';
import { keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import BotInfoComponent from '../../components/data/bot-info-component';
import { useBotStore } from '../../store/bot-store';
import {
  NavigationArea,
  useNavigationStore,
} from '../../store/navigation-store';

export const Route = createFileRoute('/bots')({
  component: Bots,
});

function Bots() {
  const {
    queryClient,
    botService,
  }: { queryClient: QueryClient; botService: BotService } =
    Route.useRouteContext();

  const { query, activeBotId } = useBotStore();

  const { data, isFetching } = useQuery(
    {
      queryKey: ['bots', query.pageNumber],
      queryFn: () => botService.listBots(query).then((page) => page.payload),
      placeholderData: keepPreviousData,
    },
    queryClient,
  );
  const setActiveArea = useNavigationStore((state) => state.setActiveArea);

  setActiveArea(NavigationArea.BOTS);

  return (
    <div className="flex items-center flex-col mt-5 sm:w-full">
      {data?.map((bot) => (
        <BotInfoComponent
          info={bot}
          selected={!!activeBotId && activeBotId === bot.id}
        ></BotInfoComponent>
      ))}
    </div>
  );
}
