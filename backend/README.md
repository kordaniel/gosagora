# GosaGora Backend
Backend for GosaGora service

### Tech Stack
- Typescript
- Node.js
- Express
- Sequelize
- Postgres
- Firebase-admin SDK

## Setup
### Requirements
The versions listed below are the ones that have been used while developing and testing
- Node.js 20.10
- Npm 10.2.3
- Docker 28.1.1
- Docker Compose 2.35.1

### App
Start by installing the required libraries

```bash
npm install
```

### Setup environment
The following environments are supported
- production
- development
- test

Make sure that all the required environment variables that are defined in the envSchema of [config](https://github.com/kordaniel/gosagora/blob/main/backend/src/utils/config.ts) are set. You can define these in a [`.env.<ENVIRONMENT>`](https://github.com/kordaniel/gosagora/blob/main/backend/.env.example) file, where you substitute `<ENVIRONMENT>` for any of the supported environments. This is the recommended way for development and test environments. For production environments please refer to your cloud providers instructions for how to setup the environment variables in a secure way.

### Run in production environment
```bash
npm run tsc && npm run start
```

### Run in dev & test environments

### Dev
Use `npm run dev` for development under normal circumstances. This command will terminate all processes and docker containers when exited.
```bash
npm run devdb:start - start postgres dev container
npm run devdb:stop  - stop postgres dev container
npm run devdb:clear - stop postgres dev container, deleting all stored data
npm run dev:leavedb - runs devdb:start and the express application, leaving devdb running
npm run dev  - runs dev:leavedb and finally devdb:stop at SIGINT (ctrl+c) event
npm run lint - run linting
npm run migration:dev:down - rollback database migration
```

### Test
Use `npm run test` for single test runs. This command will terminate all processes and docker containers when done. You can use `npm run test:leavedb` for repetitive runs and manually run `npm run testdb:stop` when done.
```bash
npm run testdb:start - start postgres test container
npm run testdb:stop  - stop postgres test container
npm run testdb:clear - stop postgres test container, deleting all stored data
npm run test:leavedb - runs testdb:start and runs tests, leaving testdb running
npm run test - runs test:leavedb and then testdb:stop when tests finishes
```

### Connect to dockerized postgres
Dev and test environments are configured to run and use a dockerized postgres container running at the dev localhost. You can connect to it using psql with the following command:
```bash
docker exec -it <CONTAINER_ID> psql -U <username> <password>
```
