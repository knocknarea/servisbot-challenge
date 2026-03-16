import { BotInfo, BotStatus } from '@servisbot/model';
import { cleanup, render } from '@testing-library/react';
import BotInfoComponent from './bot-info-component';
describe('Inidicative React Component Test', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the bot info', () => {
    const bot = {
      name: 'A Bot',
      description: 'A description',
      created: new Date().getTime() / 1000,
      id: 'bot-id',
      status: BotStatus.ENABLED,
    } as BotInfo;

    const info = render(
      <BotInfoComponent
        info={bot}
        selected={false}
        enableLog={false}
      ></BotInfoComponent>,
    );
  });
});
