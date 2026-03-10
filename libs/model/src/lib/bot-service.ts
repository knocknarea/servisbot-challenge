import { BotInfo, BotLogMessage, BotWorkerInfo } from "./model.js";
import { Page, PageQuery } from "./pagination.js";

/**
 * Forgive me, this really should be in a different library, given
 * time constraints, I want to highlight capability approach.
 * 
 * This interface can be implemented as an in memory store of 'bots'
 * or it can be client to a microservice or database that provides bots.
 * 
 * In addition, it can be a wrapper around axios or fetch for use in the 
 * react frontend, i.e. a client implementation. If I get time I will show you.
 *
 * Note also, I could have just broken this out into separate services, but
 * you know, time...
 * 
 * @export
 * @interface BotService
 */
export interface BotService {

    /**
     * Given a pagination query, return a page full of bots.
     *
     * @param {PageQuery} query
     * @return {*}  {Page<BotInfo>}
     * @memberof BotService
     */
    listBots(query: PageQuery): Promise<Page<BotInfo>>

    /**
     * Fetch a specific bot or none if it does not exist.
     *
     * @param {string} id
     * @return {*}  {(BotInfo | undefined)}
     * @memberof BotService
     */
    fetchBot(id: string): Promise<BotInfo | undefined>;

    /**
     * Given a bot id, list all workers paginated.
     *
     * @param {string} botId
     * @param {PageQuery} query
     * @return {*}  {Page<BotWorkerInfo>}
     * @memberof BotService
     */
    listWorker(botId: string | undefined, query: PageQuery): Promise<Page<BotWorkerInfo>>;

    /**
     * Fetch a specific worker by it's ID
     *
     * @param {string} workerId
     * @return {*}  {(BotWorkerInfo | undefined)}
     * @memberof BotService
     */
    fetchWorker(workerId: string): Promise<BotWorkerInfo | undefined>;


    /**
     * List Bot worker logs. 
     * 
     * Optionally filtering by a bot and/or worker 
     *
     * @param {PageQuery} query
     * @param {string | undefined} botId
     * @param {(string | undefined)} workerId
     * @return {*}  {Page<BotLogMessage>}
     * @memberof BotService
     */
    listLogs(query: PageQuery, botId?: string, workerId?: string): Promise<Page<BotLogMessage>>

    // ... other methods for CRUD on bots, etc.
}