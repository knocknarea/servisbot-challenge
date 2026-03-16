import { BotService, PageQuery } from '@servisbot/model';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { Spinner } from 'flowbite-react';
import { useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment } from 'react/jsx-runtime';
import LogMessage from '../../components/data/log-message-component';
import { BotStoreInitialState } from '../../store/bot-store';
import {
  NavigationArea,
  useNavigationStore,
} from '../../store/navigation-store';
import ListHeading from './list-heading-component';

export default function LogListing({
  query,
  setQuery,
  botId,
  workerId,
}: {
  query: PageQuery;
  setQuery: (q: PageQuery) => void;
  botId?: string;
  workerId?: string;
}) {
  const {
    queryClient,
    botService,
  }: { queryClient: QueryClient; botService: BotService } = useRouteContext({
    from: '/logs',
  });

  const queryKey = [
    'log-listing',
    botId ? botId : 'general',
    workerId ? workerId : 'general',
  ];

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: queryKey,
      queryFn: ({ pageParam }) =>
        botService.listLogs(pageParam, botId, workerId),
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

  setActiveArea(NavigationArea.LOGS);

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
      console.log(`Searching Logs for ? ${q?.query || 'ALL'}`);
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
        <div className="sm:w-4/5">
          <ListHeading
            title={
              workerId
                ? 'Worker Log Listing'
                : botId
                  ? 'Bot Log Listing'
                  : 'All Logs'
            }
            placeholder="Search Logs..."
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
            endMessage={<div className="text-center">No more log items...</div>}
          >
            {pages?.pages.map((page, groupId) => (
              <Fragment key={groupId}>
                {page.payload.map((message) => (
                  <LogMessage
                    logMessage={message}
                    showWorkerLogAction={!workerId}
                  ></LogMessage>
                ))}
              </Fragment>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
