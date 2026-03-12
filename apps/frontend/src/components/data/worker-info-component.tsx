import { BotInfo, BotWorkerInfo } from '@servisbot/model';
import { fromUnixTime } from 'date-fns';
import { Card } from 'flowbite-react';
import { useBotStore } from '../../store/bot-store';

export default function WorkerInfo({
  bot,
  worker,
}: {
  bot: BotInfo;
  worker: BotWorkerInfo;
}) {
  const { setActiveWorkerId } = useBotStore();

  return (
    <Card
      className={`w-full mb-2 mr-10`}
      onClick={() => setActiveWorkerId(bot.id, worker.id)}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {worker.name}
      </h5>

      {/* if there is a description show it */}
      {worker.description ? (
        <p className="font-normal italic text-gray-700 dark:text-gray-400">
          {worker.description}
        </p>
      ) : null}

      <p>
        <span className="mr-2">Created</span>
        <span className="font-medium">
          {fromUnixTime(worker.created).toDateString()}
        </span>
      </p>
    </Card>
  );
}
