import { AppConfig, BotInfo, BotLogMessage, BotService, BotStatus, BotWorkerInfo, Page, PageQuery, PaginationUtil } from '@servisbot/model';
import { nanoid } from 'nanoid';

/**
 * An In Memory randomized Bot repository and service
 * for use in local/test scenarios
 *
 * @export
 * @class InMemnoryBotService
 * @implements {BotService}
 */
export class InMemnoryBotService implements BotService {

  // Keyed on bot id, map of all in memory bots
  private botMap: Map<string, BotInfo> = new Map();

  // keyed on bot id, map of all in memory bot workers
  private botWorkerMap: Map<string, BotWorkerInfo[]> = new Map();

  private workerMap: Map<string, BotWorkerInfo> = new Map();

  // keyed on bot id, map of all log messages related to a bot.
  private logMap: Map<string, BotLogMessage[]> = new Map();

  /**
   * Creates an instance of InMemnoryBotService.
   * @param {AppConfig} config
   * @param {number} [maxBots=20]
   * @param {number} [maxWorkers=6]
   * @param {number} [maxLogs=30]
   * @param {boolean} [exact=true] whether to use exact specified max figures or random up to
   * @memberof InMemnoryBotService
   */
  public constructor(
    private config: AppConfig,
    maxBots = 20,
    maxWorkers = 6,
    maxLogs = 30,
    private exact = true 
  ) {
    // Generate an in memory database to use for this running instance.
    this.buildInMemoryDB(
      maxBots >= 0 ? maxBots : 0, 
      maxWorkers >= 0 ? maxWorkers : 0, 
      maxLogs >= 0 ? maxLogs : 0);
  }

  listBots(pageQuery: PageQuery): Promise<Page<BotInfo>> {
    return Promise.resolve(PaginationUtil.slicePage(
      [...this.botMap.values()],
      pageQuery,
      (bot, q) => bot.name.includes(q) || bot.description?.includes(q) || false
    ));
  }

  fetchBot(id: string): Promise<BotInfo | undefined> {
    return Promise.resolve(this.botMap.has(id) ? this.botMap.get(id) : undefined);
  }

  listWorker(botId: string | undefined, pageQuery: PageQuery): Promise<Page<BotWorkerInfo>> {
    //
    // Either the specific workers belonging to a specific bot or a flattened array of all workers.
    // 
    const workerArray = botId ? this.botWorkerMap.get(botId) || [] : [...this.botWorkerMap.values()].flat();

    return Promise.resolve(PaginationUtil.slicePage(
      workerArray,
      pageQuery,
      (bot, q) => bot.name.includes(q) || bot.description?.includes(q) || false
    ));
  }

  fetchWorker(workerId: string): Promise<BotWorkerInfo | undefined> {
    return Promise.resolve(this.workerMap.get(workerId) || undefined);
  }

  listLogs(pageQuery: PageQuery, botId?: string, workerId?: string): Promise<Page<BotLogMessage>> {
    let logArray = workerId ? this.logMap.get(workerId) : [...this.logMap.values()].flat();
    if(botId) {
      logArray = logArray?.filter((log) => log.bot === botId);
    }
    return Promise.resolve(PaginationUtil.slicePage(
      logArray || [],
      pageQuery,
      (log, q) => log.message.includes(q) || false
    ));
  }

  //
  // Build a random in memory bot database for subsequent querying by this service
  //
  private buildInMemoryDB(maxBots: number, maxWorkers: number, maxLogs: number): void {

    const statusEnumKeys = Object.keys(BotStatus);

    console.log(`Generating ${maxBots} InMemory Random Bots...`);

    // Build a map of randomly generated bot according to what was specified
    // in the constructor
    [...Array(this.exact ? maxBots : Math.floor(Math.random() * maxBots)).keys()].forEach((index) => {
      const randomStatus = statusEnumKeys[Math.floor(Math.random() * statusEnumKeys.length)];

      const bot = {
        id: nanoid(),
        name: `InMem Bot (${this.config.deploymentType}) - ${index + 1}`,
        description: `Description for Bot ${index + 1}`,
        // Bit of wrangling here to coherse typescript into understanding 
        // that we are selecting an enum by string value
        status: BotStatus[randomStatus as keyof typeof BotStatus],
        created: new Date().getTime()
      } as BotInfo;

      console.log(`Generated InMemory Bot ${bot.id}`);

      this.botMap.set(bot.id, bot);
      const workers = this.generateWorkers(bot, maxWorkers);
      
      console.log(`Generated ${workers.length} Workers for Bot ${bot.id}`);

      //
      // Record these workers against the bot
      //
      this.botWorkerMap.set(bot.id, workers);

      //
      // Add reverse lookup for worker
      //
      workers.forEach((worker) => this.workerMap.set(worker.id, worker));

      workers.forEach((worker) => {
        const logs = this.generateLogs(bot, worker, maxLogs);
        console.log(`Generated ${logs.length} Log Messages for Bot ${bot.id} : Worker ${worker.id}`);
        // Note what logs belong to the worker
        this.logMap.set(worker.id, logs);
      });

    });   
  }

  private generateWorkers(bot: BotInfo, maxWorkers: number): BotWorkerInfo[] {
    return [...Array(this.exact ? maxWorkers : Math.floor(Math.random() * maxWorkers))].map((index) => ({
      id: nanoid(),
      name: `${bot.name} : Worker ${index + 1}`,
      description: `Worker ${index + 1} Description`,
      created: new Date().getTime(),
      bot: bot.name
    } as BotWorkerInfo));
  }

  private generateLogs(bot: BotInfo, worker: BotWorkerInfo, maxLogs: number): BotLogMessage[] {
    return [...Array(this.exact ? maxLogs : Math.floor(Math.random() * maxLogs)).map((index) => ({
      id: nanoid(),
      bot: bot.id,
      worker: worker.id,
      message: `Random Message ${index + 1} for Bot ${bot.name} : ${worker.name}`,
      created: new Date().toISOString()
    } as BotLogMessage))];
  }
}