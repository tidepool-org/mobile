// Copyright 2015-present 650 Industries. All rights reserved.

#import "AppDelegate.h"

#import <ExpoKit/EXViewController.h>
#import <RollbarReactNative/RollbarReactNative.h>

@interface AppDelegate ()

@property (nonatomic, strong) EXViewController *rootViewController;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

    [RollbarReactNative initWithAccessToken:@"00788919100a467e8fb08144b427890e"];

    return result;
}

#pragma mark - NativeNotifications

- (void)setEnvironment:(NSString *)environment
{
  _environment = environment;
  [[Rollbar currentConfiguration] setEnvironment:environment];
}

- (void)setUser:(NSString *)userId username:(NSString *)username userFullName:(NSString *)userFullName
{
  _userId = userId;
  _username = username;
  _userFullName = userFullName;
  [[Rollbar currentConfiguration] setPersonId:_userId username:_userFullName email:_username];
}

- (void)clearUser {
  _userId = nil;
  _username = nil;
  _userFullName = nil;
  [[Rollbar currentConfiguration] setPersonId:_userId username:_userFullName email:_username];
}

- (void)testNativeCrash {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)),
                 dispatch_get_main_queue(),
                 ^{
                   @throw NSInternalInconsistencyException;
                 });
}

- (void)testLogWarning:(NSString *)message {
  [RollbarReactNative warningWithMessage:message];
}

- (void)testLogError:(NSString *)message {
  [RollbarReactNative errorWithMessage:message];
}

@end
