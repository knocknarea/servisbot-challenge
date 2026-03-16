import { BotInfo, BotService } from '@servisbot/model';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Spinner,
} from 'flowbite-react';
import { Fragment, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BotStoreInitialState, useBotStore } from '../../store/bot-store';
import WorkerInfo from './worker-info-component';

export default function WorkerInfoPanel({
  bot,
  selected,
}: {
  bot: BotInfo;
  selected: boolean;
}) {
  const [workerVisible, setWorkerVisible] = useState(selected);

  const {
    queryClient,
    botService,
  }: { queryClient: QueryClient; botService: BotService } = useRouteContext({
    from: '/bots',
  });

  const workerListData = useBotStore((store) => store.workerMap.get(bot.id));

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ['worker-list', bot.id],
      queryFn: ({ pageParam }) => botService.listWorker(bot.id, pageParam),
      initialPageParam:
        workerListData?.query || BotStoreInitialState.botListQuery,
      getNextPageParam: (lastPage) =>
        !lastPage?.complete
          ? {
              pageNumber: lastPage.pageNumber + 1,
              pageSize: lastPage.pageSize,
              query: lastPage.query,
            }
          : undefined,
      enabled: workerVisible,
    },
    queryClient,
  );

  return (
    <Accordion
      collapseAll={!selected}
      onClick={() => setWorkerVisible(!workerVisible)}
    >
      <AccordionPanel>
        <AccordionTitle>Associated Workers</AccordionTitle>
        <AccordionContent
          id={`worker-${bot.id}`}
          className="max-h-120 overflow-scroll"
        >
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
            endMessage={<div>No more workers...</div>}
            scrollableTarget={`worker-${bot.id}`}
          >
            {pages?.pages.map((page, groupId) => (
              <Fragment key={groupId}>
                {page.payload.map((worker) => (
                  <WorkerInfo worker={worker} bot={bot}></WorkerInfo>
                ))}
              </Fragment>
            ))}
          </InfiniteScroll>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  );
}
