/*
 * Copyright (c) 2018, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

#import "NativeNotifications.h"

#import <UIKit/UIKit.h>
#import "AppDelegate.h"

@implementation NativeNotifications

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setUser:(NSString *)userId username:(NSString *)username userFullName:(NSString *)userFullName)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate setUser:userId username:username userFullName:userFullName];
  });
}

RCT_EXPORT_METHOD(clearUser)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate clearUser];
  });
}

RCT_EXPORT_METHOD(setEnvironment:(NSString *)environment)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate setEnvironment:environment];
  });
}

RCT_EXPORT_METHOD(testNativeCrash)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate testNativeCrash];
  });
}

RCT_EXPORT_METHOD(testLogWarning:(NSString *)message)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate testLogWarning:message];
  });
}

RCT_EXPORT_METHOD(testLogError:(NSString *)message)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate testLogError:message];
  });
}

@end
