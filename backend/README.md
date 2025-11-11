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
- Npx 10.2.3
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

#### Insert initial user
You can insert the initial admin user by running the script [injectInitialAdminUser](https://github.com/kordaniel/gosagora/blob/main/backend/src/database/injectInitialAdminUser.ts), for example in your CI/CD process. On execution, it verifies that no users currently exists in the system. If no users are found, it creates and inserts a new admin user using the credentials provided through environment variables. The script is designed to run only in a production environment and does nothing if it's executed in any other environment or if the production environment is not set up correctly. In addition to the standard production environment variables, this script requires the following variables to be set:

```bash
NODE_ENV=production
GOSAGORA_ADMIN_EMAIL=<SPECIFY.ROOT@ADMIN.EMAIL.COM>
GOSAGORA_ADMIN_DISPLAYNAME=<SPECIFY_ADMIN_DISPLAYNAME>
GOSAGORA_ADMIN_PASSWORD=<SPECIFY_ADMIN_PASSWD>
```

### Run in dev & test environments
These environments requires that the Firebase Local Emulator Suite is running.

#### Leave emulator running and use npm scripts
Start the emulator for the desired environment with the provided scripts

```bash
firebase --config ../firebase-<dev|test>.json emulators:start
./run-firebase-dev-emulator.sh
./run-firebase-test-emulator.sh
```
When the emulator is running you can use the configured npm scripts

#### Dev env
Use `npm run dev` for development under normal circumstances. This command will start the required postgres docker container automatically as well as stop it at exit. You can use `npm run dev:leavedb` for repetitive runs and manually run `npm run devdb:stop` when done.
```bash
npm run devdb:start - start postgres dev container
npm run devdb:stop  - stop postgres dev container
npm run devdb:clear - stop postgres dev container, deleting all stored data
npm run dev:leavedb - runs devdb:start and the express application, leaving devdb running
npm run dev  - runs dev:leavedb and finally devdb:stop when express app exits programmatically or at SIGINT (ctrl+c) signal
npm run lint - run linting
npm run migration:dev:down - rollback database migration
```

#### Test
Run the tests by executing the script `run-tests-with-firebase-emulator.sh`. It will spin up the test postgres docker container db, firebase emulator and then runs the tests. Once the tests complete, all started processes will be terminated gracefully.

Alternatively you can use the provided npm scripts directly, assuming you have the Firebase Emulator running.

Use `npm run test` for single test runs. This command will stop the postgres docker container when exited. You can use `npm run test:leavedb` for repetitive runs and manually run `npm run testdb:stop` when done.
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
docker container ls
docker exec -it <CONTAINER_ID> psql -U <username> <database-name, specified in docker-compose-files>
```
