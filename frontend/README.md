# GosaGora Frontend
Frontend for GosaGora service

### Tech Stack
- Typescript
- Expo React Native
- Firebase JS SDK

## Setup

### Dev env
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

Note that the development environment is configured for both Expo GO and development builds using EAS. You can switch between these after running `npm run start` by pressing the key `s`.

### Configured npm scripts
```bash
npm run start
npm run start:cc - clears expo cache
npm run start:dev - runs esbuild in watch mode and npm run start
npm run start:dev:cc - runs esbuild in watch mode and npm run start:cc
npm run lint
npm run test
npm run test:watch - run tests at every filechange
npm run typeCheck - compile ts with noEmit
```
Use the script `npm run start:dev` or `npm run start:dev:cc` for normal dev environment. If you already have built the leaflet bundle and don't intend to make any changes to it then you can use the conventional `npm run start` or `npm run start:cc`.

### Run application using Expo GO
When you have set up the firebase configuration by following the instructions defined in the main [README.md](https://github.com/kordaniel/gosagora/blob/main/README.md) of this repo and set up the `.env` file for the frontend you can run this application using Expo GO by running `npm run start`. This has some limitations, for example background location processes do not work when running the application trough Expo GO.

### Build a development application using EAS
This is the recommended way to run this application in dev environments. Read more [here](https://docs.expo.dev/develop/development-builds/introduction/) and follow [these instructions](https://docs.expo.dev/tutorial/eas/configure-development-build/#initialize-a-development-build) on how to build your own development application where all functionalities of GosaGora are supported.

- **Note that the [app.config.js](https://github.com/kordaniel/gosagora/blob/main/frontend/app.config.js) file contains an `extra.eas.projectId` property. If you are starting a new project based on GosaGora instead of building an official GosaGora development client as a part of GosaGora's official dev team, start by removing the `eas` propery that contains the projectId for the official GosaGora development build from the `extra` dictionary**

#### EAS requirements / setup
EAS CLI is required, install with
```bash
npm install -g eas-cli
```
- [Create a expo account](https://expo.dev/signup) and sign in with
```bash
eas login
```
- Initialize your project by running the following command once
```bash
eas init
```
- Copy the generated projectId into the key `extra.eas.projectId` of [app.config.js](https://github.com/kordaniel/gosagora/blob/main/frontend/app.config.js).


- Specify the same environment variables into the key `build.development.env` of [eas.json](https://github.com/kordaniel/gosagora/blob/main/frontend/eas.json).

#### Build the development build
Now you are ready to build your development build, you can build it in the cloud by running
```bash
eas build --platform android --profile development
```
and install the built application on your android device by following the instructions on your profile page of [expo.dev](https://expo.dev/). You can also build it locally with
```bash
eas build --platform android --profile development --local
```
which will generate an apk package that you can transfer into your android phone and install manually
