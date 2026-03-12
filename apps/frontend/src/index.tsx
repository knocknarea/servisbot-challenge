import { BotServiceClient } from '@servisbot/bot-service-client';
import { BuildType, DeploymentType } from '@servisbot/model';
import { QueryClient } from '@tanstack/react-query';
import { createRouter, Router, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';

// Tanstack Query Client
const queryClient = new QueryClient();

const botService = new BotServiceClient({
  serviceName: 'bot ui',
  deploymentType: DeploymentType.LOCAL,
  buildType: BuildType.DEVELOPMENT,
  botServiceUrl: 'http://localhost:3000',
});

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
    <RouterProvider router={mainRouter} />
  </StrictMode>,
);
