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
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TPNativeHealth, RCTEventEmitter)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(shouldShowHealthKitUI)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(healthKitInterfaceEnabledForCurrentUser)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(healthKitInterfaceConfiguredForOtherUser)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(currentHealthKitUsername)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(enableHealthKitInterface)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(disableHealthKitInterface)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(startUploadingHistorical)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(stopUploadingHistoricalAndReset)

@end
