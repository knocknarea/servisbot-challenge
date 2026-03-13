import { BotLogMessageDto } from '@servisbot/model';
import { Card } from 'flowbite-react';

export default function LogMessage({
  logMessage,
}: {
  logMessage: BotLogMessageDto;
}) {
  return (
    <Card className={`md:w-1/2 md:mx-20 sm:w-full sm:mx-10 mb-2`}>
      <p className="font-normal italic text-gray-700 dark:text-gray-400">
        {logMessage.created}
      </p>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {logMessage.message}
      </h5>

      <p className="font-normal italic text-gray-700 dark:text-gray-400">
        <span className="mr-2">Worker:</span>
        <span>{logMessage.workerInfo.name}</span>
      </p>

      <p className="font-normal italic text-gray-700 dark:text-gray-400">
        <span className="mr-2">Bot:</span>
        <span>{logMessage.botInfo.name}</span>
      </p>
    </Card>
  );
}
