#!/usr/bin/env bash

set -o nounset

# Update manifests to use specified release channel rather than default
pwd # remove this later, just testing Travis CI

if [ "$(uname)" == "Darwin" ]; then
    sed -i '' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" android/app/src/main/assets/shell-app-manifest.json
    sed -i '' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" android/app/src/main/assets/kernel-manifest.json
    sed -i '' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" ios/Tidepool/Supporting/shell-app-manifest.json
    sed -i '' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" ios/Tidepool/Supporting/EXShell.json
    sed -i '' "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
else
    sed -i "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
    sed -i "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
    sed -i "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
    sed -i "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
    sed -i "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
fi
cat ios/Tidepool/Supporting/EXShell.plist # remove this later, just testing Travis CI