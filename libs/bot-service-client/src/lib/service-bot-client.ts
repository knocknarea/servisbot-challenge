import { BotInfo, BotLogMessage, BotService, BotWorkerInfo, ClientAppConfig, Page, PageQuery } from "@servisbot/model";
import axios from "axios";

/**
 * A mirror image of the bot service, but from the client side (i.e react or whatever)
 *
 * @export
 * @class BotServiceClient
 * @implements {BotService}
 */
export class BotServiceClient implements BotService {

  public constructor(private config: ClientAppConfig) {

  }

  listBots(query: PageQuery): Promise<Page<BotInfo>> {
    return axios.get(`${this.config.botServiceUrl}/bot`, {
      params: query
    })
  }
  fetchBot(id: string): Promise<BotInfo | undefined> {
    return axios.get(`${this.config.botServiceUrl}/bot/${id}`);
  }

  listWorker(botId: string | undefined, query: PageQuery): Promise<Page<BotWorkerInfo>> {
    return botId ? axios.get(`${this.config.botServiceUrl}/bot/${botId}/worker`, {
      params: query
    }) : axios.get(`${this.config.botServiceUrl}/worker`, { params: query});
  }

  fetchWorker(workerId: string): Promise<BotWorkerInfo | undefined> {
    return axios.get(`${this.config.botServiceUrl}/worker/${workerId}`)
  }

  listLogs(query: PageQuery, botId?: string, workerId?: string): Promise<Page<BotLogMessage>> {
    if(workerId) {
      return axios.get(`${this.config.botServiceUrl}/worker/${workerId}/log`, { params: query });
    } else if(botId) {
      return axios.get(`${this.config.botServiceUrl}/bot/${botId}/log`, { params: query });
    } else {
      return axios.get(`${this.config.botServiceUrl}/log`, { params: query });
    }
  }

}
