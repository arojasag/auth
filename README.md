# Express JWT authentication microservice

This project is a microservice built on Express for authentication
using Json Web Tokens (JWT). Authentication is made with email and
password. Users are identified with an uuid.
This microservice supports token invalidation through a Redis instance,
using the whitelist approach.

---

## Table of contents

- [Express JWT authentication microservice](#express-jwt-authentication-microservice)
  - [Table of contents](#table-of-contents)
  - [Using Docker](#using-docker)
  - [Environment variables](#environment-variables)
    - [Generating a working `.env` file](#generating-a-working-env-file)
  - [Building the project](#building-the-project)
  - [Running the microservice](#running-the-microservice)
  - [Stopping and removing the microservice](#stopping-and-removing-the-microservice)
    - [Partially clean enviroment](#partially-clean-enviroment)
    - [Fully clean environment](#fully-clean-environment)
  - [Scripts](#scripts)
    - [Setup](#setup)
    - [Lint](#lint)
    - [Development](#development)

---

## Using Docker

> [!IMPORTANT]
> Make sure your `.dockerignore` file is set up correctly to exclude any
> unnecessary files. Like so:

```sh
cat .gitignore .prodignore > .dockerignore
```

## Environment variables

Many configurations can be set configuring a `.env` file. If you want
to see and example about it, please go to [this file](./.env.example).

> [!NOTE]
> Once you have [created](#generating-a-working-env-file) your `.env`
> file, you can run any docker command for
> [building](#building-the-project) or [running](#running-the-microservice)
> the project without having to do any extra work.

### Generating a working `.env` file

To generate a file based on a working template run this command:

```sh
cp .env.example .env
```

## Building the project

To build the service run the following command:

```sh
docker compose build
```

It's optional to include the environment variables needed to setup
postgres, Redis and the JWT signing key. These should be stored in
an `.env`-ish file and you can specify it like this. But it's not
really necessary if you already have it created.

```sh
docker compose --env-file .env build
```

## Running the microservice

In order to use the microservice, it is necessary to have already built the
services. Once you've done that, you can run the following command:

```sh
docker compose up
```

If you want to run it and build it at the same time you can:

1. [Remove the stale version](#stopping-and-removing-the-microservice)
2. Run the following command:

```sh
docker compose up --build
```

## Stopping and removing the microservice

You can produce a [partially](#partially-clean-enviroment) clean
environment or a [clean environmentment](#fully-clean-environment).

### Partially clean enviroment

> [!TIP]
> If you want to have a _almost_ clean build you need to stop
> and remove containers, networks by running:

```sh
docker compose down --remove-orphans
```

### Fully clean environment

> [!WARNING]
> The following command gives you a clean slate to start from, but it
> remove the volumes too. So any data that you may have, it will be
> removed as well.

```sh
docker compose down --remove-orphans --volumes
```

## Scripts

These are a few useful scripts, more will be added to improve DX

### Setup

```bash
npm install
```

### Lint

```bash
npm run lint
```

### Development

```bash
npm run dev
```
