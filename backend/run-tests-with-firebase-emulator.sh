#!/usr/bin/env bash

npm run testdb:start
firebase --config ../firebase.test.json --project gosagora-test emulators:exec "npx cross-env NODE_ENV=test jest" --import=./../firebase-emulator-data/test-data --export-on-exit
npm run testdb:stop

