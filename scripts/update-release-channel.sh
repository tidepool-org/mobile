#!/usr/bin/env bash

# Update manifests to use specified release channel rather than default
pwd
sed -i '.bak' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\"$1\"/" android/app/src/main/assets/shell-app-manifest.json
sed -i '.bak' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\"$1\"/" android/app/src/main/assets/kernel-manifest.json
sed -i '.bak' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\"$1\"/" ios/Tidepool/Supporting/shell-app-manifest.json
sed -i '.bak' "s/\"releaseChannel\"\:\"default\"/\"releaseChannel\"\:\"$1\"/" ios/Tidepool/Supporting/EXShell.json
sed -i '.bak' "s/\<string\>default\<\/string\>/\<string\>$1\<\/string\>/" ios/Tidepool/Supporting/EXShell.plist
