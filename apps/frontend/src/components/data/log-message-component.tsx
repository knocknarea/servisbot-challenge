import { BotLogMessageDto } from '@servisbot/model';
import { Link } from '@tanstack/react-router';
import { Button, Card, HR } from 'flowbite-react';
import { FaArrowRight } from 'react-icons/fa6';
import BotStatusBadge from './bot-status-component';

export default function LogMessage({
  logMessage,
  // Whether to show the link to the worker log
  // this only really required if we are looking at a stream
  // of logs for the specific bot, and want to narrow down to a
  // specific worker.
  showWorkerLogAction = false,
}: {
  logMessage: BotLogMessageDto;
  showWorkerLogAction?: boolean;
}) {
  return (
    <Card className={`mt-5 mb-2`}>
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-1 font-bold">Bot</div>
        <div className="col-span-2 col-start-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-400">
          <span>{logMessage.botInfo.name}</span>
          <BotStatusBadge
            bot={logMessage.botInfo}
            className="ml-2 w-auto"
          ></BotStatusBadge>
        </div>
        <div className="col-span-1 col-start-4">
          <Link to={`/logs/bot/${logMessage.botInfo.id}`}>
            <Button outline className="w-auto self-center">
              Logs
              <FaArrowRight className="ml-5" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-1 font-bold">Worker</div>
        <div className="col-span-2 col-start-2 flex items-start gap-2 font-bold text-gray-700 dark:text-gray-400">
          {logMessage.workerInfo.name}
        </div>
        <div className="col-span-1 col-start-4">
          {showWorkerLogAction ? (
            <Link to={`/logs/worker/${logMessage.workerInfo.id}`}>
              <Button outline className="w-auto self-center align-top">
                Logs
                <FaArrowRight className="ml-5" />
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-1 font-bold">Created</div>
        <div className="col-span-3 col-start-2 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-400">
          <span>{logMessage.created}</span>
        </div>
      </div>
      <HR />
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {logMessage.message}
      </h5>
    </Card>
  );
}
