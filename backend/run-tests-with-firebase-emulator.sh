#!/usr/bin/env bash

npm run testdb:start
firebase --config ../firebase-test.json emulators:exec "npx cross-env NODE_ENV=test jest"
npm run testdb:stop

