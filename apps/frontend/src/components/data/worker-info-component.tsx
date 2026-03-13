import { BotInfo, BotWorkerInfoDto } from '@servisbot/model';
import { fromUnixTime } from 'date-fns';
import { Button, Card } from 'flowbite-react';
import { FaArrowRight } from 'react-icons/fa6';
import { useBotStore } from '../../store/bot-store';

export default function WorkerInfo({
  bot,
  worker,
  enableLog = true,
  showBotInfo = false,
}: {
  bot: BotInfo;
  worker: BotWorkerInfoDto;
  enableLog?: boolean;
  showBotInfo?: boolean;
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
      {showBotInfo ? (
        <p className="font-normal italic text-gray-700 dark:text-gray-400">
          <span className="mr-2">Owned By Bot:</span>
          <span>{bot.name}</span>
        </p>
      ) : null}
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
      {enableLog ? (
        <Button outline className="w-1/2 self-center">
          Show Worker Logs
          <FaArrowRight className="ml-5" />
        </Button>
      ) : null}
    </Card>
  );
}
