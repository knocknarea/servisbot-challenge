import { AppConfig, BuildType, DeploymentType } from '@servisbot/model';
import { InMemnoryBotService } from './bot-service-memory.js';

const config = { 
  deploymentType: DeploymentType.LOCAL,
  buildType: BuildType.DEVELOPMENT  
} as AppConfig;

describe('bot-server-im-memory-test', () => {
  it('should generate multiples of 5', async () => {
    const maxBots = 5;
    const maxWorkerPerBot = 5;
    const maxLogsPerWorker = 5;

    const server = new InMemnoryBotService(config, maxBots, maxWorkerPerBot, maxLogsPerWorker);

    const bots = await server.listBots({ pageNumber: 0, pageSize: maxBots + 1});
    expect(bots.payload.length).toBe(maxBots);

    const workers = await server.listWorker(undefined, { pageNumber: 0, pageSize: maxBots * maxLogsPerWorker + 1 });
    expect(workers.payload.length).toBe(maxBots * maxWorkerPerBot);

    const logs = await server.listLogs({ pageNumber: 0, pageSize: maxBots * maxWorkerPerBot * maxLogsPerWorker + 1});
    expect(logs.payload.length).toBe(maxBots * maxWorkerPerBot * maxLogsPerWorker);

  });
});
