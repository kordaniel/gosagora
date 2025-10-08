# GosaGora
GosaGora is a platform where the sailing community can meet, share experiences and grow together.

Whether you're cruising or competing, GosaGora supports every sailor — with powerful features specially crafted for racing and event management. Using our service you can easily create, manage and participate in races, calculate results and connect with other sailors.

## Overview
This repository contains a full-stack project, **GosaGora**, which is composed of a React Native frontend and a express backend. Both the front- and backend contains detailed documentation within their respective directories.

### Auth flow
GosaGora integrates with [Firebase](https://firebase.google.com/) API for user authentication, while all authorization logic is handled by the backend. The backend manages its own PostgreSQL database, which stores all service data except for users sensitive data.

```console
┌────────────┐                        ┌──────────────────┐
│            |----[1] Sign In-------->│                  |
|  Frontend  |                        |     Firebase     |
|            |<---[2] Credentials-----│  Authentication  |
└┬─────────┬─┘     (with IdToken)     |                  |
 |        / \                         └─────┬──┬─────────┘
 |         └---------┐                     / \ |
[3] Send IdToken in  |                      |  |
Authorization header |                      |  |
of every request     |                      |  |
 |         ┌---------┘                      |  |
 |     [6] Sign In/API request              |  |
 |     Status response                      |  |
\ /        |                                |  |
┌┴─────────┴┐                               |  |
│           |----[4] Verifies IdToken-------┘  |
|  Backend  |                                  |
|           |<---[5] Decoded IdToken-----------┘
└───────────┘
```

## Setup
This project is configured to run in three different environments:
- production
- development
- test

Each environment uses distinct data sources. The [Firebase API](https://firebase.google.com/) and a live postgres database are used in production environments.

In test and development environments the project is configured to use the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) and containerized postgres databases.

Each of these three environments isolates their own data, it remains fully contained and is never exposed outside the environment.

Both of these needs to be initialized and configured according to the instructions below.

### Firebase
Start by creating a Firebase project to connect to.

#### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click **"Create a Firebase project"**, choose a name, and follow the steps

#### 2. Enable Email/Password Authentication
- In the Firebase console, go to **Build/Authentication -> Sign-in method**
- Click **"Add new provider"**
- Enable **Email/Password**

#### 3. Add a Web App to Firebase for the frontend
Even though the frontend is a React Native app it uses a web config object.
- Go to **Project Overview/Project Settings -> General**
- Under **Your apps**, click **</> Web App**
- Register the app name, skip Firebase Hosting
- **Copy the provided FirebaseConfig object into `frontend/firebaseConfig.json` and format it as JSON**
- The config contains no secrets

#### 4. Generate Admin SDK Credentials for the backend
- Go to **Project Overview/Project Settings -> Service accounts**
- Click **"Generate new private key"**
- You can skip the next steps if you run the backend in a **Google Cloud** environment, it sets the config automatically
- Outside Google Cloud, **copy the generated JSON into `backend/firebaseServiceAccount.json`**
- This file contains sensitive information, **keep it secure**
- Make sure that `.env.<production|development|test>` contains the variable `GOOGLE_APPLICATION_CREDENTIALS` and that it points to the JSON file


### Firebase CLI and Firebase Local Emulator Suite for DEV/TEST environments
Use [Firebase CLI](https://firebase.google.com/docs/cli) in development and test environments.

#### Supported Firebase CLI version and its requirements
- Firebase CLI 14.2.1
- Node.js 16
- Java JDK 11

All of the following commands should be run in the root of the repository!

#### 1. Make sure you have the firebase CLI installed on your dev platform
See [Firebase CLI (github)](https://github.com/firebase/firebase-tools) for instructions

#### 2. Login with your Google account
After logging in you should see your Firebase project under your projects
```bash
firebase login
firebase projects:list
```

#### 3. Init a firebase working project
```bash
firebase init
```
Select the following options:
- Emulators: Set up local emulators for Firebase products
- Use an existing project
- The Firebase project you created
- Authentication Emulator
- Default port (9099)
- Enable Emulator UI YES, leave port empty (defaults to 4000)
- Download emulators now

This creates the files `.firebaserc` and `firebase.json` files in the root directory, which contains the basic config for the emulator for running in production environment.

#### 4. Create dev and test environemnts (Firebase projects)
- Follow steps 1-4 in the previous section (Firebase) and create two new projects in the firebase console.
- The configuration and scripts provided in this repository assumes that you name these as `gosagora-dev` and `gosagora-test`. If you choose any other names you will have to edit the provided configuration manually.
- In step 3 name the frontend firebaseConfig files as
  - **`frontend/firebaseDevConfig.json`**
  - **`frontend/firebaseTestConfig.json`**
- In step 4 name the backend configuration files as
  - **`backend/firebaseDevServiceAccount.json`**
  - **`backend/firebaseTestServiceAccount.json`**

#### 5. Add your newly created projects to `.firebaserc`
- Add the following key:value pairs to the projects map
  - "dev": "gosagora-dev"
  - "test": "gosagora-test"

#### 6. Execute in dev/test env
Follow the instructions inside the `backend/` and `frontend/` directories to run the application in dev and test environments.
#### 6.1. Configure back- and frontends to use the Local Emulator
- Make sure that the backend environment configuration `.env.<development|test>` file contains the variable `FIREBASE_AUTH_EMULATOR_HOST` and that it is set to the Host:Port of the running emulator for the desired env. This url should not contain anything except the **host/ip:port**.
- Similarily for the frontend make sure that the `.env` file contains the same `FIREBASE_AUTH_EMULATOR_HOST` variable in dev and test environments.
- **If this variable is not set correctly the live Firebase API will be used instead of the emulator**

#### 7. View the Firebase Local Emulator Suite UI
When the emulator is running you can open the suitable url from the following list in your browser to inspect the status of the emulator.
- `http://localhost:4000/` for dev env
- `http://localhost:4001/` for test env


### Project structure, important files
Make sure that you have these files set up correctly. See the instruction above and in the respective directories for both the front- and backends
```console
├── backend/
│   ├── firebaseServiceAccount.json - For production environment, required to be configured when running outside Google Cloud
│   ├── firebaseDevServiceAccount.json - Required for dev env
│   ├── firebaseTestServiceAccount.json - Required for test env
│   └── .env.<production|development|test> - Required, See backend/.env.example for required variables
├── firebase-emulator-data/ - Persistent data directory for the emulator
├── frontend/
│   ├── assets/
|   │   ├── bundles/ - Automatically generated bundles (esbuild). Do no place any files here manually
|   │   └── html/ - HTML documents
│   ├── src/
|   │   └── bundles/ - Esbuild source directory for ts modules to transpile and bundle into assets/bundles/
│   ├── vendor/ - Third-party code and other assets
│   ├── webstyles/ - Esbuild source directory for web icons and css to transpile and bundle into assets/bundles/
│   ├── firebaseConfig.ts - For production environment, required
│   ├── firebaseDevConfig.ts - Required for dev env
│   ├── firebaseTestConfig.ts - Required for test env
│   └── .env - See frontend/.env.example for required variables
├── packages/ - Typescript project reference(s)
│   └── common/ - Common types for back- and frontends
├── .firebaserc - Contains your configured firebase projects
├── firebase.json - Firebase emulator config for your project. This file is generated when you run firebase init and is not used
├── firebase.dev.json - Firebase emulator config for dev-env
└── firebase.test.json - Firebase emulator config for test-env
```
