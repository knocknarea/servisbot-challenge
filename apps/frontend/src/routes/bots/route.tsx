import { BotService, PageQuery } from '@servisbot/model';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from 'flowbite-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment } from 'react/jsx-runtime';
import BotInfoComponent from '../../components/data/bot-info-component';
import { BotStoreInitialState, useBotStore } from '../../store/bot-store';
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

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ['bot-listing'],
      queryFn: ({ pageParam }) => botService.listBots(pageParam),
      initialPageParam: query || BotStoreInitialState.query,
      getNextPageParam: (lastPage) =>
        !lastPage.complete
          ? ({
              pageNumber: lastPage.pageNumber + 1,
              pageSize: lastPage.pageSize,
              query: lastPage.query,
            } as PageQuery)
          : undefined,
    },
    queryClient,
  );

  const setActiveArea = useNavigationStore((state) => state.setActiveArea);

  setActiveArea(NavigationArea.BOTS);

  // Note: dataLength is derived from reduction of the length
  // of the payload of all pages. TanStack infinite query stores
  // each page separately in a list.
  return (
    <InfiniteScroll
      className="h-full overflow-auto flex items-center flex-col mt-5 sm:w-full"
      dataLength={
        pages?.pages
          .map((page) => page.payload.length)
          .reduce((a, b) => a + b, 0) || 0
      }
      next={() => !isFetchingNextPage && fetchNextPage()}
      hasMore={hasNextPage}
      loader={<Spinner size="sm" />}
      endMessage={<div>No more items...</div>}
    >
      {pages?.pages.map((page, groupId) => (
        <Fragment key={groupId}>
          {page.payload.map((bot) => (
            <BotInfoComponent
              info={bot}
              selected={!!activeBotId && activeBotId === bot.id}
              enableLog={true}
            />
          ))}
        </Fragment>
      ))}
    </InfiniteScroll>
  );
}
