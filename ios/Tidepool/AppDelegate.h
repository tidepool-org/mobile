// Copyright 2015-present 650 Industries. All rights reserved.

#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (copy, nonatomic) NSString *environment;
@property (copy, nonatomic) NSString *userId;
@property (copy, nonatomic) NSString *username;
@property (copy, nonatomic) NSString *userFullName;

- (void)setEnvironment:(NSString *)environment;
- (void)setUser:(NSString *)userId username:(NSString *)username userFullName:(NSString *)userFullName;
- (void)clearUser;
- (void)testNativeCrash;
- (void)testLogWarning:(NSString *)message;
- (void)testLogError:(NSString *)message;
@end
