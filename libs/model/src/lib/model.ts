
/**
 * A status enum for a given bot
 *
 * @export
 * @enum {number}
 */
export enum BotStatus {
  ENABLED,
  DISABLED,
  PAUSED
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
