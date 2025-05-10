#!/usr/bin/env bash

firebase --config ../firebase.test.json emulators:start --project gosagora-test --import=./../firebase-emulator-data/test-data --export-on-exit
