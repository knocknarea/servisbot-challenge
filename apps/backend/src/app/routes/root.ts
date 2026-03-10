import { InMemnoryBotService } from '@servisbot/bot-service-server';
import { AppConfig, BotInfo, BotLogMessage, BotWorkerInfo, BuildType, DeploymentType, Page, PageQuery } from '@servisbot/model';
import { FastifyInstance } from 'fastify';

const botService = new InMemnoryBotService({
  deploymentType: DeploymentType.LOCAL,
  buildType: BuildType.DEVELOPMENT
} as AppConfig, 10, 10, 10);

export default async function (fastify: FastifyInstance) {
  //
  // Healthcheck, node viability.
  //
  fastify.get('/health/check', async function (_, res) {
    return res.send({ status: 'OK'});
  });

  //
  // Paginated listing of bots, using singlar endpoint name inline with REST best practice
  //
  fastify.get<{ 
    Querystring: PageQuery,
    Reply: Page<BotInfo>}>('/bot', async (req, res) => {

    return res.send(await botService.listBots(req.query));
  });

  // Get a specific bot by id
  fastify.get<{Params: { botId: string }}>('/bot/:botId', async (req, res) => {

    const { botId } = req.params;

    const bot = await botService.fetchBot(botId);
    return bot ? res.send(bot) : res.notFound(JSON.stringify({ message: 'Bot Not Found'}));
  });

  // All bot logs, irrespective of worker origin
  fastify.get<{
    Querystring: PageQuery,
    Params: { botId: string },
    Reply: Page<BotLogMessage>}>('/bot/:botId/log', async (req, res) => {

    const { botId } = req.params;

    return res.send(await botService.listLogs(req.query, botId, undefined));
  });

  // List paginated workers of a bot by id
  fastify.get<{
    Querystring: PageQuery,
    Params: { botId: string },
    Reply: Page<BotWorkerInfo>}>('/bot/:botId/worker', async (req, res) => {

    const { botId } = req.params;

    return res.send(await botService.listWorker(botId, req.query));
  });

  // Get a specific worker by id
  fastify.get<{Params: { 
    workerId: string
   }}>('/worker/:workerId', async (req, res) => {

    const { workerId } = req.params;

    const worker = await botService.fetchWorker(workerId);
    return worker ? res.send(worker) : res.notFound(JSON.stringify({ message: 'Worker Not Found'}));
  });

  //
  // List of logs (pagingated) for specific worker.
  //
  fastify.get<{
    Querystring: PageQuery,
    Params: { workerId: string },
    Reply: Page<BotLogMessage>}>('/worker/:workerId/log', async (req, res) => {

    const { workerId } = req.params;

    return res.send(await botService.listLogs(req.query, undefined, workerId));
  });

  // Get all logs..
  fastify.get<{
    Querystring: PageQuery,
    Reply: Page<BotLogMessage>}>('/log', async (req, res) => {
      return res.send(await botService.listLogs(req.query, undefined, undefined));
    });

}
