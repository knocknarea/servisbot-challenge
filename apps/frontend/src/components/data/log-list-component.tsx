import { BotService, PageQuery } from '@servisbot/model';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { Spinner } from 'flowbite-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Fragment } from 'react/jsx-runtime';
import LogMessage from '../../components/data/log-message-component';
import { BotStoreInitialState } from '../../store/bot-store';
import {
  NavigationArea,
  useNavigationStore,
} from '../../store/navigation-store';

export default function LogListing({
  query,
  botId,
  workerId,
}: {
  query: PageQuery;
  botId?: string;
  workerId?: string;
}) {
  const {
    queryClient,
    botService,
  }: { queryClient: QueryClient; botService: BotService } = useRouteContext({
    from: '/logs',
  });

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: [
        'log-listing',
        botId ? botId : 'general',
        workerId ? workerId : 'general',
      ],
      queryFn: ({ pageParam }) =>
        botService.listLogs(pageParam, botId, workerId),
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

  setActiveArea(NavigationArea.LOGS);

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
      endMessage={<div>No more log items...</div>}
    >
      {pages?.pages.map((page, groupId) => (
        <Fragment key={groupId}>
          {page.payload.map((message) => (
            <LogMessage logMessage={message}></LogMessage>
          ))}
        </Fragment>
      ))}
    </InfiniteScroll>
  );
}
