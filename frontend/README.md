# GosaGora Frontend
React Native Frontend for GosaGora service.

## Setup

### Requirements
Start by installing the required libraries:
```bash
npm install
```

### Setup environment
Make sure that all the environment variables listed in the file [.env.example](https://github.com/kordaniel/gosagora/blob/main/frontend/.env.example) are set. You can for example copy the `.env.example` file to a file called `.env` and specify the variables there.

The following environments are supported:
- production
- development
- test

### Run
```bash
npm run start
npm run start:cc (Clears expo cache)
npm run lint
npm run test
npm run test:dev (Watch)
```
