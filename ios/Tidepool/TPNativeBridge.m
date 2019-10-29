/*
 * Copyright (c) 2019, Tidepool Project
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

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TPNative, NSObject)

RCT_EXTERN_METHOD(setUser:(NSString *)userId username:(NSString *)username userFullName:(NSString *)userFullName isDSAUser:(BOOL)isDSAUser sessionToken:(NSString *)sessionToken)
RCT_EXTERN_METHOD(clearUser)
RCT_EXTERN_METHOD(setEnvironment:(NSString *)environment)

RCT_EXTERN_METHOD(testNativeCrash)
RCT_EXTERN_METHOD(testLogWarning:(NSString *)message)
RCT_EXTERN_METHOD(testLogError:(NSString *)message)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isUploaderLoggingEnabled)
RCT_EXTERN_METHOD(enableUploaderLogging:(BOOL)enable)
RCT_EXTERN_METHOD(emailUploaderLogs)

@end
