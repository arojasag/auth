# Express JWT authentication microservice

This project is a microservice built on Express for authentication
using Json Web Tokens (JWT). Authentication is made with email and
password. Users are identified with an uuid.
This microservice supports token invalidation through a Redis instance,
using the whitelist approach.

## Using Docker

> [!IMPORTANT]
> Make sure your `.dockerignore` file is set up correctly to exclude any
> unnecessary files. Like so:

```sh
cat .gitignore .prodignore > .dockerignore
```

### Building the project

To build the service run the following command:

```sh
docker compose build
```

It's optional to include the environment variables needed to setup
postgres, Redis and the JWT signing key. These should be stored in
an `.env`-ish file and you can specify it like this:

```sh
docker compose --env-file .env build
```

### Running the API

In order to use the API, it is necessary to have already built the
services. Once you've done that, you can run the following command:

```sh
docker compose up
```

If you want to run it and build it at the same time you can:

1. [Remove the stale version](#stopping-and-removing-the-api)
2. Run the following command:

```sh
docker compose up --build
```

### Stopping and removing the API

> [!TIP]
> If you remove the volumes you will have a clean state to start with

If you do not wish to get rid of the containers for services but
preserve the volumes you can run:

```sh
docker compose down --remove-orphans
```

If you want to get rid of the containers for services and volumes,
you should run:

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
