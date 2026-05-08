# Dev Setup

## Installation Requirements

- [node.js](https://nodejs.org/en)
- [docker](https://docs.docker.com/reference/cli/docker/)
- [colima](https://github.com/abiosoft/colima) or some other docker engine

## Using the development database

Use `docker context ls` to see which docker engine is being used

1. colima start
2. docker compose up

Use `docker compose down` and `colima stop` to end these services.
