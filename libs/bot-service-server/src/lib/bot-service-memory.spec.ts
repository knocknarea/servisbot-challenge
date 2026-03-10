import { AppConfig, BuildType, DeploymentType } from '@servisbot/model';
import { InMemnoryBotService } from './bot-service-memory.js';

const config = { 
  deploymentType: DeploymentType.LOCAL,
  buildType: BuildType.DEVELOPMENT  
} as AppConfig;

describe('bot-server-im-memory-test', () => {
  it('should generate max 5', () => {
    const server = new InMemnoryBotService(config, 5, 5, 5);

    expect(server.fetchBot('id')).resolves.toBeFalsy();
  });
});
