/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

#import "LaunchScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation
                                            moduleProvider:nil
                                             launchOptions:launchOptions];

  // See https://github.com/facebook/react-native/issues/16376
#if RCT_DEV
  [bridge moduleForClass:[RCTDevLoadingView class]];
#endif
  RCTRootView *reactRootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Tidepool"
                                            initialProperties:nil];
  reactRootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  UIView *launchView = self.window.rootViewController.view;
  UIActivityIndicatorView *activityIndicatorView = [launchView viewWithTag:1];
  [LaunchScreen showLaunchView:self.window.rootViewController.view activityIndicatorView:activityIndicatorView reactRootView:reactRootView];

  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = reactRootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
