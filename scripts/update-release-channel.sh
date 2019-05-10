#!/usr/bin/env bash

set -o nounset

# Update manifests to use specified release channel rather than default

target_file=android/app/src/main/assets/shell-app-manifest.json
sed -e "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" "$target_file" > "$target_file.$$" && mv "$target_file.$$" "$target_file"

target_file=android/app/src/main/assets/kernel-manifest.json
sed -e "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" "$target_file" > "$target_file.$$" && mv "$target_file.$$" "$target_file"

target_file=ios/Tidepool/Supporting/shell-app-manifest.json
sed -e "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" "$target_file" > "$target_file.$$" && mv "$target_file.$$" "$target_file"

target_file=ios/Tidepool/Supporting/EXShell.json
sed -e "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\""$1"\"/" "$target_file" > "$target_file.$$" && mv "$target_file.$$" "$target_file"

target_file=ios/Tidepool/Supporting/EXShell.plist
sed -e "s/\<string\>default\<\/string\>/\<string\>"$1"\<\/string\>/" "$target_file" > "$target_file.$$" && mv "$target_file.$$" "$target_file"

cat ios/Tidepool/Supporting/EXShell.plist # remove this later, just testing Travis CI
