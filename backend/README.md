# GosaGora Backend
Backend for GosaGora service.

## Setup

### Requirements
Start by installing the required libraries:
```bash
npm install
```

### Setup environment
The following environments are supported:
- production
- development
- test

Make sure that all the required environment variables that are defined in the envSchema of [config](https://github.com/kordaniel/gosagora/blob/main/backend/src/utils/config.ts) are set. You can define these in a [`.env.<ENVIRONMENT>`](https://github.com/kordaniel/gosagora/blob/main/backend/.env.example) file, where you substitute `<ENVIRONMENT>` for any of the supported environments. This is the recommended way for development and test environments. For production environments please refer to your cloud providers instructions for how to setup the environment variables in a secure way.

### Run
```bash
npm run dev
npm run tsc && npm run start
npm run test
```
