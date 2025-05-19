# Express JWT authentication microservice

This project is a microservice built on Express for authentication
using Json Web Tokens (JWT). Authentication is made with email and
password. Users are identified with an uuid.
This microservice supports token invalidation through a Redis instance,
using the whitelist approach.

## Using Docker

### Building the project

To build the services it's necessary to include the environment
variables needed to setup postgres, Redis and the JWT signing key.
These should be stored in an `.env` file

  ```sh
  docker compose --env-file .env build
  ```

### Testing the  API

In order to test the API, it is necessary to have already built the
services. Once you've done that, you can run the following command:

  ```sh
  docker compose run --rm api npm run test:docker
  ```

The option `--rm` allows this command to automatically remove the
container when it exits, i.e: when the test run finished.

### Running the API

In order to use the API, it is necessary to have already built the
services. Once you've done that, you can run the following command:

  ```sh
  docker compose up
  ```

### Stopping and removing the API

If you want to get rid of the containers for services and volumes,
you should run:

  ```sh
  docker compose down --volumes
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

### Test

```bash
npm run test
```

### Development

```bash
npm run dev
```
