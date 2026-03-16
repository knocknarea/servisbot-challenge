import { BotServiceClient } from '@servisbot/bot-service-client';
import { QueryClient } from '@tanstack/react-query';
import { createRouter, Router, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import buildConfig, { ConfigContext } from './config/config-factory';
import { routeTree } from './routeTree.gen';

// Tanstack Query Client
const queryClient = new QueryClient();

const config = buildConfig();

const botService = new BotServiceClient(config);

// Set up a Router instance with a context that contains
// both the tanstack query client and our bot service connection
const mainRouter = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
  context: {
    queryClient,
    botService,
  },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof Router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigContext value={config}>
      <RouterProvider router={mainRouter} />
    </ConfigContext>
  </StrictMode>,
);
