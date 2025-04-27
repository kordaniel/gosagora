# GosaGora Frontend
Frontend for GosaGora service

### Tech Stack
- Typescript
- Expo React Native
- Firebase

## Setup

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

Make sure that all the environment variables listed in the file [.env.example](https://github.com/kordaniel/gosagora/blob/main/frontend/.env.example) are set. You can for example copy the `.env.example` file to a file called `.env` and specify the variables there.

### Run
```bash
npm run start
npm run start:cc - clears expo cache
npm run lint
npm run test
npm run test:watch - run tests at every filechange
npm run typeCheck - compile ts with noEmit
```
