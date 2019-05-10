#!/usr/bin/env bash

set -o nounset

updateReleaseChannel() {
    sed -e "$expression" "$target_file" > "$target_file.bak" && mv "$target_file.bak" "$target_file"
}

releaseChannel=$1

expression="s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$releaseChannel"\"/"
target_file="android/app/src/main/assets/shell-app-manifest.json"
updateReleaseChannel
target_file="android/app/src/main/assets/kernel-manifest.json"
updateReleaseChannel
target_file="ios/Tidepool/Supporting/shell-app-manifest.json"
updateReleaseChannel
target_file="ios/Tidepool/Supporting/EXShell.json"
updateReleaseChannel

expression="s/\<string\>default\<\/string\>/\<string\>"$releaseChannel"\<\/string\>/"
target_file="ios/Tidepool/Supporting/EXShell.plist"
updateReleaseChannel

cat ios/Tidepool/Supporting/EXShell.plist # remove this later, just testing Travis CI
