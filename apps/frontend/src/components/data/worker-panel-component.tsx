import { BotInfo, BotService } from '@servisbot/model';
import { keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from 'flowbite-react';
import { useState } from 'react';
import { useBotStore } from '../../store/bot-store';
import WorkerInfo from './worker-info-component';

export default function WorkerInfoPanel({ bot }: { bot: BotInfo }) {
  const [workerVisible, setWorkerVisible] = useState(false);

  const {
    queryClient,
    botService,
  }: { queryClient: QueryClient; botService: BotService } = useRouteContext({
    from: '/bots',
  });

  const workerListData = useBotStore((store) => store.workerMap.get(bot.id));

  const { data, refetch } = useQuery(
    {
      queryKey: ['worker-list', bot.id, workerListData?.query.pageNumber || 0],
      queryFn: () =>
        botService
          .listWorker(
            bot.id,
            workerListData?.query || { pageNumber: 0, pageSize: 10 },
          )
          .then((page) => page.payload),
      placeholderData: keepPreviousData,
      enabled: workerVisible,
    },
    queryClient,
  );

  return (
    <Accordion collapseAll onClick={() => setWorkerVisible(!workerVisible)}>
      <AccordionPanel>
        <AccordionTitle>Associated Workers</AccordionTitle>
        <AccordionContent>
          {data?.map((worker) => (
            <WorkerInfo bot={bot} worker={worker}></WorkerInfo>
          ))}
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  );
}
