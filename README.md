# Challenge Accepted

This is my submission for the [ServisBot Code Challenge](https://github.com/servisbot/servisbot-coding-challenge)

I have decided to build this challenge solution using [Nx Workspaces](https://nx.dev)

I highly recommend that you install the [NxConsole Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console). While not essential, the nx commands will work via npx as listed below, it provides a better insight into the operation of nx.

Nx is a mono repo management tool and, in my opinion, is rather excellent at it.

# Local Components

| Component | Description                                                     | Port |
| --------- | --------------------------------------------------------------- | ---- |
| backend   | Fastify API server producing local inmemory data model elements | 3000 |
| frontend  | React application showing bots/workers and logs                 | 4200 |

# Approach

This is a POC log monitoring solution.

The main menu/header should show you _exactly and clearly_ what environment you are dealing with. The main menu contains two options, BOTS and LOGS. Keeping things simple.

The objective is to design the UI along the lines of normal drill down analysis that one would expect. What bots have I, can I narrow down the list to a specific bot. Within the bot listing there is then an accordion expansion to an infinitely scrollable list of connected workers. The reason for leaving it to the expansion of the accordion to show the workers, is because at the listing stage, you might not be interested in a bot **until you are**.

From the bot list you can choose to look at all logs for a given bot or those belonging to an associated worker.

From the LOGS menu, clicking on logs, shows you all logs available as an infinite scroller together with the ability to filter according to content of message.

Each entry in this list, allows you to 'drill down' and see just the logs specific to the bot or the worker.

Back buttons work also to get back to where you were (ensure visible was not implemented in this case, but it's relaitively trivial to implement using Zustand state)

# Use of AI

I **did not** use any AI assistance building this POC. I am not idealogically one way or the other about it. There is a MIGRATE_VITEST_4.md file created in tools/ai-migrations. This was placed there by NX as part of upgrading the workspace via npx nx migrate (to update all dependencies). It is an instruction file for any future AI tool.

# Tech stack

**Build and code arrangement**: Nx Workspaces

**Backend** Simple Fastify API

**Frontend** React Application

**State Management**: Split between Zustand store and Tanstack Query (tanstack query is a production ready, manager of queries, it does not actually do the querying as it's name suggests, rather devers to your given solution)

**Modeling and Services** You will notice that, as an example, I have split the model and service implementations as libraries under the libs folder (Nx is very good for this). The idea here is split domain and services into separately managed simple libraries that can be used anywhere. You might also notice in the model library, I have extending the basic model to DTOs to decorate the base model on a per API call basis, to reduce round trips to the backend. I have also called out inconsistencies in the base model, such as inconsistent naming of attributes, i.e. **bot** meaning two different things in two different models. Not sure if this a deliberate thing, please don't be offended.

The service for producing and retrieving data is defined in a simple interface BotService (defined in the model library, ideally this would be placed into some sort of base service library, but I put it where it is for convenience)

The BotServiceMemory implementation, generates an in memory representation of real data graph graph and allows for filtering and retrieval of this in memory data.

The BotServiceClient is an implementatin of BotService that acts as a proxy to axios calls to the API (or a database in reality). This client could be augmented to include security checks, such as authentication headers, etc if needs be.

# Getting Started.

Install Dependencies

```
npm install
```

(Or whatever you are having yourself)

Then to go directly to the meat of things, you can run the backend and frontend simultaneously as follows:

```
npx nx run-many -t serve -p backend,frontend
```

You can confirm that the backend API is up and running using the [Healthcheck Endpoint](http://localhost:3000/health/check)

You can also go to the [Frontend Application](http://localhost:4200)

To run these applications separately use

```
npx nx serve backend
```

and/or

```
npx nx serve frontend
```

# Docker Setup.

The docker setup is not ideal in that it depends on a prebuild setup when in reality
the build should be self contained to the docker build using multilayered docker file
approach. i.e. FROM node as build -> FROM hardened as deploy ... COPY FROM build...

It's been a while since I looked at this approach with Nx and I did not want to get stuck on it
for the sake of compeleting this task.

## Build and run Backend

Do the following:

```
npx nx build backend
docker build apps/backend -t servisbot:backend
docker run -p 3000:3000 servisbot:backend
```

## Build and run the Frontend (an nginx fronted container on built react app)

```
npx nx build frontend
docker build apps/frontend -t servisbot:frontend
docker run -p 80:80 servisbot:frontend
```

# What's missing

Obviously Authentication. An application like this would not be open to just anyone. However, I assumed that the
objective was structure and UX approach together with tech choices. So I left it out.
Had I included it, it would be via OpenID/OAuth and IDP together with API Authorization header checks against signed tokens belonging to the IDP

Error handling leaves a lot to be desired. Tanstack and Zustand can be leveraged to convey error conditions in relation to interacting with the API.

Extensive unit testing. I've included indicative testing where appropriate. This is most certainly
not the approach I would take to developing production ready software.

# Some issues

I ran into a problem building and running jest tests with React testing. It's a common issue, I moved on from it, but there is a broken test in bot-info-component. If I have more time I can fix it.

There are a number of warnings against npm install in terms of vulnerabilities of dependencies, this would not fly in real life, I'd spend some time sorting this out.

# Finally

I know this took more time that it should, if it's too little too late, that's not a problem. I had a blast doing this. Otherwise, I hope to chat to you again soon.

Thank you.

# Some links and documentation related to Nx Workspaces.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve backend
```

To create a production bundle:

```sh
npx nx build backend
```

To see all available targets to run for a project, run:

```sh
npx nx show project backend
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/node:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
