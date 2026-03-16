import { BotInfo, BotStatus } from '@servisbot/model';
import { Link } from '@tanstack/react-router';
import { fromUnixTime } from 'date-fns';
import { Button, Card, HR } from 'flowbite-react';
import { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useBotStore, WorkerListData } from '../../store/bot-store';
import BotStatusBadge from './bot-status-component';
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
  enableLog = true,
}: {
  info: BotInfo;
  selected: boolean;
  enableLog: boolean;
}) {
  const { setActiveBotId, addWorker } = useBotStore();

  useEffect(() => {
    addWorker(info.id, {
      query: { pageNumber: 0, pageSize: 10 },
    } as WorkerListData);
  }, [info, addWorker]);

  return (
    <Card
      data-testid={info.id}
      className={`mt-5 mb-2 ${selected ? 'bg-slate-50' : null}`}
      onClick={() => setActiveBotId(info.id)}
    >
      <h5
        data-testid={`${info.id}-name`}
        className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {info.name}
      </h5>

      {/* if there is a description show it */}
      {info.description ? (
        <p
          data-testid={`${info.id}-description`}
          className="font-normal italic text-gray-700 dark:text-gray-400"
        >
          {info.description}
        </p>
      ) : null}

      <div className="flex items-center gap-2 font-normal text-gray-700 dark:text-gray-400">
        <span className="mr-2">Status</span>
        <span className="ml-2">
          <BotStatusBadge bot={info}></BotStatusBadge>
        </span>
      </div>
      <p>
        <span className="mr-2">Created</span>
        <span data-testid={`${info.id}-created`} className="font-medium">
          {fromUnixTime(info.created).toDateString()}
        </span>
      </p>
      {enableLog ? (
        <Link to={`/logs/bot/${info.id}`}>
          <Button
            data-testid={`${info.id}-logs`}
            outline
            className="w-auto self-center"
          >
            Show Bot Logs
            <FaArrowRight className="ml-5" />
          </Button>
        </Link>
      ) : null}
      <HR />
      <WorkerInfoPanel bot={info} selected={selected}></WorkerInfoPanel>
    </Card>
  );
}
