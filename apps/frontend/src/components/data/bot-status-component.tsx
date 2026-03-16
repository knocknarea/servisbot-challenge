import { BotInfo, BotStatus } from '@servisbot/model';
import { Badge } from 'flowbite-react';

// Convenience lookup for badge type
const badgeTypeMap: Map<BotStatus, string> = new Map([
  [BotStatus.ENABLED, 'success'],
  [BotStatus.DISABLED, 'failure'],
  [BotStatus.PAUSED, 'warning'],
]);

export default function BotStatusBadge({
  bot,
  className,
}: {
  bot: BotInfo;
  className?: string;
}) {
  return (
    <Badge
      color={badgeTypeMap.get(bot.status)}
      size="sm"
      className={`${className ? className : null}`}
    >
      {bot.status}
    </Badge>
  );
}
