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

### Firebase
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

### Project structure, important files
Make sure that you have these files set up correctly. See the instruction above and in the respective directories for both the front- and backends
```console
├── backend/
│   ├── firebaseServiceAccount.json - Required to be set when running outside Google Cloud
│   └── .env.<production|development|test> - See backend/.env.example for required variables
├── frontend/
│   ├── firebaseConfig.ts - Required
│   └── .env - See frontend/.env.example for required variables
└── firebase-service-account.json
```
