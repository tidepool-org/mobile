// Copyright 2015-present 650 Industries. All rights reserved.

#import "AppDelegate.h"
#import "ExpoKit.h"
#import "EXViewController.h"
#import "NativeNotifications.h"

#import "EXKernel.h"
#import <React/RCTBridge.h>
#import <RollbarReactNative/RollbarReactNative.h>

@interface AppDelegate ()

@property (nonatomic, strong) EXViewController *rootViewController;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [RollbarReactNative initWithAccessToken:@"00788919100a467e8fb08144b427890e"];

    _window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    _window.backgroundColor = [UIColor whiteColor];
    [[ExpoKit sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
    _rootViewController = [ExpoKit sharedInstance].rootViewController;
    _window.rootViewController = _rootViewController;

    [_window makeKeyAndVisible];

    return YES;
}

#pragma mark - Handling URLs

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(id)annotation
{
    return [[ExpoKit sharedInstance] application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler
{
    return [[ExpoKit sharedInstance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

#pragma mark - Notifications

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)token
{
    [[ExpoKit sharedInstance] application:application didRegisterForRemoteNotificationsWithDeviceToken:token];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)err
{
    [[ExpoKit sharedInstance] application:application didFailToRegisterForRemoteNotificationsWithError:err];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
    [[ExpoKit sharedInstance] application:application didReceiveRemoteNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(nonnull UILocalNotification *)notification
{
    [[ExpoKit sharedInstance] application:application didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(nonnull UIUserNotificationSettings *)notificationSettings
{
    [[ExpoKit sharedInstance] application:application didRegisterUserNotificationSettings:notificationSettings];
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
