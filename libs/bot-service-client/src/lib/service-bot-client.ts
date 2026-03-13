import { BotInfo, BotLogMessageDto, BotService, BotWorkerInfoDto, ClientAppConfig, Page, PageQuery } from "@servisbot/model";
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
    }).then((r) => r.data);
  }

  fetchBot(id: string): Promise<BotInfo | undefined> {
    return axios.get(`${this.config.botServiceUrl}/bot/${id}`).then((r) => r.data);
  }

  listWorker(botId: string | undefined, query: PageQuery): Promise<Page<BotWorkerInfoDto>> {
    const response =  botId ? axios.get(`${this.config.botServiceUrl}/bot/${botId}/worker`, {
      params: query
    }) : axios.get(`${this.config.botServiceUrl}/worker`, { params: query}).then((r) => r.data);
    return response.then((r) => r.data);
  }

  fetchWorker(workerId: string): Promise<BotWorkerInfoDto | undefined> {
    return axios.get(`${this.config.botServiceUrl}/worker/${workerId}`).then((r) => r.data);
  }

  listLogs(query: PageQuery, botId?: string, workerId?: string): Promise<Page<BotLogMessageDto>> {
    let response;

    if(workerId) {
      response = axios.get(`${this.config.botServiceUrl}/worker/${workerId}/log`, { params: query });
    } else if(botId) {
      response = axios.get(`${this.config.botServiceUrl}/bot/${botId}/log`, { params: query });
    } else {
      response = axios.get(`${this.config.botServiceUrl}/log`, { params: query });
    }
    return response.then((r) => r.data);
  }

}
