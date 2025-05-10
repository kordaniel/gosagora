#!/usr/bin/env bash

firebase --config ../firebase.dev.json emulators:start --project gosagora-dev --import=./../firebase-emulator-data/development-data --export-on-exit
