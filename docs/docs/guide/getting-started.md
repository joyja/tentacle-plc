# Getting Started

## Prerequisites

- [Node.js v14+](https://nodejs.org/)

## Installation

For production, we recommend using Docker, but you can also install locally by following these instructions.

::: tip COMING SOON!
we're working on instructions for local installation without Docker.
:::

## Docker

The best way to use Tentacle PLC in production is with docker and docker-compose. We recommend having three docker containers, one for Tentacle PLC, one for Tentacle PLC UI, and one for Code-Server. We have a docker-compose file to facilitate this in our Git repository, here are basic instructions:

1. Install docker per the [Docker Install Instructions](https://docs.docker.com/engine/install/).

2. Install docker-compose per the [Docker Compose Install Instructions](https://docs.docker.com/compose/install/).

3. Download [docker-compose.yml](https://gitlab.com/joyja/tentacle-plc/-/raw/main/docker-compose.yml?inline=false) from the Tentacle PLC repository.

4. Run `docker-compose up -d` from the directory where you downloaded the `docker-compose.yml` file.

This will create the three docker containers from the most recent versions we've tested on Docker Hub:

- [Tentacle PLC Public Docker Image](https://hub.docker.com/r/joyja/tentacle-plc)
- [Tentacle PLC UI Public Docker Image](https://hub.docker.com/r/joyja/tentacle-plc-front)
- [Code Server Public Docker Image](https://hub.docker.com/r/codercom/code-server)