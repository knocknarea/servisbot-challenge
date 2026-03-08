import { BotInfo, Page, PageQuery } from '@servisbot/model';
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/health/check', async function (_, res) {
    return res.send({ status: 'OK'});
  });

  fastify.get<{ 
    Querystring: PageQuery,
    Reply: Page<BotInfo>}>('/list/bots', async (req, res) => {

    const pageQuery = req.query.pageNumber;

    return res.send({ pageNumber: 0, pageSize: 20, complete: true, payload: [
      { id: 'id1', name: 'bot1', description: 'desc 1', created: 1234 }
    ]} as Page<BotInfo>);
  });
}
