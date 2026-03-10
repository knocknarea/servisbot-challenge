import { AppConfig, BuildType, DeploymentType } from '@servisbot/model';
import { InMemnoryBotService } from './bot-service-memory.js';

const config = { 
  deploymentType: DeploymentType.LOCAL,
  buildType: BuildType.DEVELOPMENT  
} as AppConfig;

describe('bot-server-im-memory-test', () => {
  it('should generate multiples of 5', async () => {
    const server = new InMemnoryBotService(config, 5, 5, 5);

    const bots = await server.listBots({ pageNumber: 0, pageSize: 10});
    expect(bots.payload.length).toBe(5);

    const workers = await server.listWorker(undefined, { pageNumber: 0, pageSize: 26 });
    expect(workers.payload.length).toBe(25);

    const logs = await server.listLogs({ pageNumber: 0, pageSize: 26});
    expect(logs.payload.length).toBe(25);

  });
});
