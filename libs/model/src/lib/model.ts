
/**
 * A status enum for a given bot
 *
 * @export
 * @enum {number}
 */
export enum BotStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  PAUSED = 'PAUSED'
}

/**
 * An interface that defines information related to a bot
 *
 * @export
 * @interface BotInfo
 */
export interface BotInfo {
  
  /**
   * The ID of the bot
   *
   * @type {string}
   * @memberof BotInfo
   */
  readonly id: string,
  
  /**
   * The name of the bot
   *
   * @type {string}
   * @memberof BotInfo
   */
  name: string,

  /**
   * The current status of the bot
   *
   * @type {BotStatus}
   * @memberof BotInfo
   */
  status: BotStatus,

  /**
   * An optional mutable description of the bot
   *
   * @type {string}
   * @memberof BotInfo
   */
  description?: string,

  /**
   * Readonly epoch timestamp for bot creation
   *
   * @type {number}
   * @memberof BotInfo
   */
  readonly created: number
  
}

export interface BotWorkerInfo {
  readonly id: string

  /**
   * Mutable name of the worker
   *
   * @type {string}
   * @memberof BotWorkerInfo
   */
  name: string;

  /**
   * Optional description text
   *
   * @type {string}
   * @memberof BotWorkerInfo
   */
  description?: string;

  /**
   * The <b>name</b> of the bot that this worker belongs to
   * 
   * Mutable, requires service layer reconcilation if changed.
   *
   * @type {string}
   * @memberof BotWorkerInfo
   */
  bot: string;

  /**
   * Epocal timestamp when created.
   *
   * @type {number}
   * @memberof BotWorkerInfo
   */
  created: number;

  //
  // Note this model is not ideal.
  // In reality the 'owning' bot should be referenced by ID
  // because the owning bot has a mutable name attribute, thus
  // could result in decapitation of the worker.
  // I suspect you already know that ;-)
  //
}

export interface BotLogMessage {

  readonly id: string;

  readonly created: string;

  readonly message: string;

  /**
   * The <b>ID</b> of the bot that generated this log message
   *
   * <i>Note</i> This is different from the same named attribute in
   * bot worker. Ideally attributes should call out the source, i.e
   * botId or botName instead of simply 'bot'
   * @type {string}
   * @memberof BotWorkerLogEntry
   */
  readonly bot: string;

  /**
   * The ID of the worker belonging to a bot that generated this message.
   * 
   * As with the bot attribute of the log, it should be clearer as to exactly 
   * which unique identity is being used here, i.e workerId
   *
   * @type {string}
   * @memberof BotLogMessage
   */
  readonly worker: string;
}