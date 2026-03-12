import { BotInfo, BotStatus } from '@servisbot/model';
import { fromUnixTime } from 'date-fns';
import { Badge, Card, HR } from 'flowbite-react';
import { useEffect } from 'react';
import { useBotStore, WorkerListData } from '../../store/bot-store';
import WorkerInfoPanel from './worker-panel-component';

// Convenience lookup for badge type
const badgeTypeMap: Map<BotStatus, string> = new Map([
  [BotStatus.ENABLED, 'success'],
  [BotStatus.DISABLED, 'failure'],
  [BotStatus.PAUSED, 'warning'],
]);

/**
 * Renders card information about a single bot instance
 *
 * @export
 * @param {{ info: BotInfo }} { info }
 */
export default function BotInfoComponent({
  info,
  selected,
}: {
  info: BotInfo;
  selected: boolean;
}) {
  const { setActiveBotId, addWorker } = useBotStore();

  useEffect(() => {
    addWorker(info.id, {
      query: { pageNumber: 0, pageSize: 10 },
    } as WorkerListData);
  }, [info, addWorker]);

  return (
    <Card
      className={`md:w-1/2 md:mx-20 sm:w-full sm:mx-10 mb-2 ${selected ? 'bg-slate-50' : null}`}
      onClick={() => setActiveBotId(info.id)}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {info.name}
      </h5>

      {/* if there is a description show it */}
      {info.description ? (
        <p className="font-normal italic text-gray-700 dark:text-gray-400">
          {info.description}
        </p>
      ) : null}

      <div className="flex items-center gap-2 font-normal text-gray-700 dark:text-gray-400">
        <span className="mr-2">Status</span>
        <Badge color={badgeTypeMap.get(info.status)} size="sm" className="ml-2">
          {info.status}
        </Badge>
      </div>
      <p>
        <span className="mr-2">Created</span>
        <span className="font-medium">
          {fromUnixTime(info.created).toDateString()}
        </span>
      </p>
      <HR />
      <WorkerInfoPanel bot={info}></WorkerInfoPanel>
    </Card>
  );
}
