import { BotService, PageQuery } from '@servisbot/model';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from 'flowbite-react';
import { useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment } from 'react/jsx-runtime';
import BotInfoComponent from '../../components/data/bot-info-component';
import ListHeading from '../../components/data/list-heading-component';
import { BotStoreInitialState, useBotStore } from '../../store/bot-store';
import {
  NavigationArea,
  useNavigationStore,
} from '../../store/navigation-store';

export const Route = createFileRoute('/bots/')({
  component: Index,
});

function Index() {
  const {
    queryClient,
    botService,
  }: { queryClient: QueryClient; botService: BotService } =
    Route.useRouteContext();

  const {
    botListQuery: query,
    activeBotId,
    setBotListQuery: setQuery,
  } = useBotStore();

  const queryKey = ['bot-listing'];

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: queryKey,
      queryFn: ({ pageParam }) => botService.listBots(pageParam),
      initialPageParam: query || BotStoreInitialState.botListQuery,
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

  // Reset the ininite query if the page query changes.
  useEffect(() => {
    queryClient.resetQueries({
      queryKey: queryKey,
      exact: true,
    });
  }, [query]);

  // Handle callback from the change of page query (by the Search Component)
  const searchBots = useCallback(
    (q: PageQuery) => {
      console.log(`Searching for ? ${q?.query || 'ALL'}`);
      setQuery(q);
    },
    [setQuery],
  );

  // Note: dataLength is derived from reduction of the length
  // of the payload of all pages. TanStack infinite query stores
  // each page separately in a list.
  return (
    <div className="absolute h-full w-full min-h-full max-h-full mt-4">
      <div className="flex flex-col w-full h-full items-center-safe">
        <div className="sm:w-4/5 mt-0 pt-0">
          <ListHeading
            title="Bot Listing"
            placeholder="Search Bots..."
            isSearching={isFetching}
            onSearch={searchBots}
            query={query}
            className="w-full"
          ></ListHeading>
        </div>
        <div className="grow overflow-auto sm:w-4/5 mt-0 mb-5">
          <InfiniteScroll
            className="sm:mx-10"
            dataLength={
              pages?.pages
                .map((page) => page.payload.length)
                .reduce((a, b) => a + b, 0) || 0
            }
            next={() => !isFetchingNextPage && fetchNextPage()}
            hasMore={hasNextPage}
            loader={<Spinner size="md" />}
            endMessage={<div className="text-center">No more bots...</div>}
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
        </div>
      </div>
    </div>
  );
}
