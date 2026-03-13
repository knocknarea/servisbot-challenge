//
// Extensions to the base model that can be used in an API.
// Generally these are aggregations and additional information that is easily retrievable
// at the backend that otherwise would represent a performance penalty
// to the frontend to fetch separately
//

import { BotInfo, BotLogMessage, BotWorkerInfo } from "./model.js";

/**
 * An extension of the base BotLogMessage to include information
 * relating to the owning bot and worker sufficient to reduce
 * round trip requests from UI to API or to prevent, brittle caching
 * logic in the UI layer.
 *
 * @export
 * @interface BotLogMessageDto
 * @extends {BotLogMessage}
 */
export interface BotLogMessageDto extends BotLogMessage {

    /**
     * More detailed information for a log message
     * that enables the log interface to show more relevant
     * details than just providing a link to the actual bot
     *
     * @type {BotInfo}
     * @memberof LogMessageDto
     */
    botInfo: BotInfo;

    /**
     * More details information for a log message that
     * allows the UI to display information about the worker
     * to the user without have to fetch that from the API separately
     *
     * @type {BotWorkerInfo}
     * @memberof LogMessageDto
     */
    workerInfo: BotWorkerInfo;
}


/**
 * API Dto for BotWorker with additional information to allow
 * for display of owner bot detail and provide navigatable opportunity
 * in the UI without additional fetch.
 * This information is easily and readily available on the backend for
 * decorating the BotWorkerInfo base model.
 *
 * @export
 * @interface BotWorkerInfoDto
 * @extends {BotWorkerInfo}
 */
export interface BotWorkerInfoDto extends BotWorkerInfo {
    botInfo: BotInfo
}