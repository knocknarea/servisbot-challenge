import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import sensible from './plugins/sensible';
import root from './routes/root';

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  fastify.register(cors, {
    origin: ['http://localhost', 'http://localhost:4200', 'http://localhost:443'],
    methods: ['GET']
  });
  // Do not touch the following lines

  fastify.register(sensible);

  // Register our API routes.
  fastify.register(root);

 }
