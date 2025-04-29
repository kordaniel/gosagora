# GosaGora
GosaGora is a platform where the sailing community can meet, share experiences and grow together.

Whether you're cruising or competing, GosaGora supports every sailor — with powerful features specially crafted for racing and event management. Using our service you can easily create, manage and participate in races, calculate results and connect with other sailors.

## Overview
This repository contains a full-stack project, **GosaGora**, which is composed of a React Native frontend and a express backend. Both the front- and backend contains detailed documentation within their respective directories.

### Auth flow
GosaGora integrates with [Firebase](https://firebase.google.com/) API for user authentication, while all authorization logic is handled by the backend. The backend manages its own PostgreSQL database, which stores all service data except for users sensitive data.

```console
┌────────────┐                        ┌──────────────────┐
│            |----[1] Sign In/Up----->│                  |
|  Frontend  |                        |     Firebase     |
|            |<---[2] Credentials-----│  Authentication  |
└┬─────────┬─┘     (with IdToken)     |                  |
 |        / \                         └─────┬──┬─────────┘
 |         └---------┐                     / \ |
[3] Send IdToken in  |                      |  |
Authorization header |                      |  |
of every request     |                      |  |
 |         ┌---------┘                      |  |
 |     [6] Sign In/Up                       |  |
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
- In the Firebase console, go to **Authentication -> Sign-in method**
- Click **"Add new provider"**
- Enable **Email/Password**

#### 3. Add a Web App to Firebase for the frontend
Even though the frontend is a React Native app it uses a web config object.
- Go to **Project Overview/Project Settings -> General**
- Under **Your apps**, click **</> Web App**
- Register the app name, skip Firebase Hosting
- **Copy the provided Firebase config JSON into `frontend/firebaseConfig.json`**
- The config contains no secrets

#### 4. Generate Admin SDK Credentials for the backend
- Go to **Project Overview/Project Settings -> Service accounts**
- Click **"Generate new private key"**
- You can skip the next steps if you run the backend in a **Google Cloud** environment, it sets the config automatically
- Outside Google Cloud, **copy the generated JSON into `backend/firebaseServiceAccount.json`**
- This file contains sensitive information, **keep it secure**
- Make sure that `.env.<production|development|test>` contains the variable `GOOGLE_APPLICATION_CREDENTIALS` and that it points to the JSON file


### Firebase CLI and Firebase Local Emulator Suite
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

Now you should be able to run the emulator, which needs to be running when you run GosaGora tests or the development environment.

#### 4. Start the Firebase Local Emulator Suite
```bash
firebase emulators:start
```
#### 5. View the Firebase Local Emulator Suite UI
Open http://localhost:4000/ in your browser to inspect the status of the emulator.

#### 6. Configure backend to use the Local Emulator
- Make sure that `.env.<development|test>` contains the variable `FIREBASE_AUTH_EMULATOR_HOST` and that it is set to the Host:Port of the running emulator. This url should not contain anything except the **host/ip:Port**. No schemes, no paths, nothing!
- **The backend will use the live Firebase API if this is not set correctly!!**



### Project structure, important files
Make sure that you have these files set up correctly. See the instruction above and in the respective directories for both the front- and backends
```console
├── backend/
│   ├── firebaseServiceAccount.json - Required to be set when running outside Google Cloud
│   └── .env.<production|development|test> - See backend/.env.example for required variables
├── frontend/
│   ├── firebaseConfig.ts - Required
│   └── .env - See frontend/.env.example for required variables
├── firebase.json - This file is generated when you run firebase init and is not used
├── firebase-dev.json - Firebase emulator config for dev-env
└── firebase-test.json - Firebase emulator config for test-env
```
