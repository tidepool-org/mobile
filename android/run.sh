#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n io.tidepool.urchin/host.exp.exponent.MainActivity
