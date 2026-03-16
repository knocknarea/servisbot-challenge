import { AppConfig, BotInfo, BotLogMessage, BotLogMessageDto, BotService, BotStatus, BotWorkerInfo, BotWorkerInfoDto, Page, PageQuery, PaginationUtil } from '@servisbot/model';
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

  //
  // Keyed on unique bot name, useful for connecting Worker
  // to it's owning bot, given worker only contains the name of the bot
  // BIG ASSUMTION HERE: Bot names are unique SYSTEM WIDE. If NOT then
  // the Worker model is incomplete/inconsistent and requires more information
  // to UNIQUELY identify the owning bot, ideally based on ID.
  //
  private botNameMap: Map<string, BotInfo> = new Map();

  // keyed on bot id, map of all in memory bot workers
  private botWorkerMap: Map<string, BotWorkerInfo[]> = new Map();

  // Keyed on worker id to quickly retrieve BotWorkerInfo details
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
      (bot, q) => bot.name?.toLowerCase().includes(q) || bot.description?.toLowerCase().includes(q) || false
    ));
  }

  fetchBot(id: string): Promise<BotInfo | undefined> {
    return Promise.resolve(this.botMap.has(id) ? this.botMap.get(id) : undefined);
  }

  listWorker(botId: string | undefined, pageQuery: PageQuery): Promise<Page<BotWorkerInfoDto>> {
    //
    // Either the specific workers belonging to a specific bot or a flattened array of all workers.
    // 
    const workerArray = botId ? this.botWorkerMap.get(botId) || [] : [...this.botWorkerMap.values()].flat();

    const source = PaginationUtil.slicePage(
      workerArray,
      pageQuery,
      (bot, q) => bot.name.toLowerCase().includes(q.toLowerCase()) || bot.description?.toLowerCase().includes(q.toLowerCase()) || false,
    );
    const decorated = { 
      ...source, 
      payload: source.payload?.map((worker) => ({
        ...worker,
        // NOTE: Worker refers to owning bot by NAME.
        botInfo: this.botNameMap.get(worker.bot)
      }))
    } as Page<BotWorkerInfoDto>;

    return Promise.resolve(decorated);
  }

  fetchWorker(workerId: string): Promise<BotWorkerInfoDto | undefined> {
    const source = this.workerMap.get(workerId);
    if(source) {
      return Promise.resolve({ 
        ...source, 
        // NOTE: Worker refers to owning bot by NAME.
        botInfo: this.botNameMap.get(source.bot)
      } as BotWorkerInfoDto)
    }
    return Promise.resolve(undefined);
  }

  listLogs(pageQuery: PageQuery, botId?: string, workerId?: string): Promise<Page<BotLogMessageDto>> {
    let logArray = workerId ? this.logMap.get(workerId) : [...this.logMap.values()].flat();
    if(botId) {
      logArray = logArray?.filter((log) => log?.bot === botId);
    }
 
    //
    // Pull from the base model layer, we will then decorate this
    // with richer information
    //
    const source = PaginationUtil.slicePage(
      logArray || [],
      pageQuery,
      (log, q) => log.message.toLowerCase().includes(q.toLowerCase()) || false
    );
 
    //
    // Decorate with retrieved Bot and Worker Details 
    // to reduce round trip from UI to API or worse
    // push, complex caching logic into the UI
    //
    const decorated = { 
      ...source,
      payload: source.payload?.map((log) => ({
        ...log,
        botInfo: this.botMap.get(log.bot),
        workerInfo: this.workerMap.get(log.worker)
      }) as BotLogMessageDto)

    } as Page<BotLogMessageDto>;

    return Promise.resolve(decorated);
  }

  //
  // Build a random in memory bot database for subsequent querying by this service
  //
  private buildInMemoryDB(maxBots: number, maxWorkers: number, maxLogs: number): void {

    const statusValues = Object.values(BotStatus);

    console.log(`Generating ${maxBots} InMemory Random Bots...`);

    // Build a map of randomly generated bot according to what was specified
    // in the constructor
    [...Array(this.exact ? maxBots : Math.floor(Math.random() * maxBots)).keys()].forEach((index) => {
      const randomStatus = Math.floor(Math.random() * statusValues.length);

      const bot = {
        id: nanoid(),
        name: `InMem Bot (${this.config.deploymentType}) - ${index + 1}`,
        description: `Description for Bot ${index + 1}`,
        // Bit of wrangling here to coherse typescript into understanding 
        // that we are selecting an enum by string value
        status: statusValues[randomStatus],
        created: new Date().getTime() / 1000
      } as BotInfo;

      console.log(`Generated InMemory Bot ${bot.id}`);

      this.botMap.set(bot.id, bot);
      this.botNameMap.set(bot.name, bot);

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
    return [...Array(this.exact ? maxWorkers : Math.floor(Math.random() * maxWorkers)).keys()].map((index) => ({
      id: nanoid(),
      name: `${bot.name} : Worker ${index + 1}`,
      description: `Worker ${index + 1} Description`,
      created: new Date().getTime() / 1000,
      bot: bot.name
    } as BotWorkerInfo));
  }

  private generateLogs(bot: BotInfo, worker: BotWorkerInfo, maxLogs: number): BotLogMessage[] {
    return [...Array(this.exact ? maxLogs : Math.floor(Math.random() * maxLogs)).keys()].map((index) => ({
      id: nanoid(),
      bot: bot.id,
      worker: worker.id,
      message: `Random Message ${index + 1} for Bot ${bot.name} : ${worker.name}`,
      created: new Date().toISOString()
    } as BotLogMessage));
  }
}