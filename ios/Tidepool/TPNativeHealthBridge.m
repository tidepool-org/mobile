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

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setHasPresentedSyncUI)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(healthKitInterfaceConfiguration)

RCT_EXTERN_METHOD(enableHealthKitInterfaceAndAuthorize)
RCT_EXTERN_METHOD(disableHealthKitInterface)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setUploaderLimitsIndex: (NSInteger)index)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setUploaderTimeoutsIndex: (NSInteger)index)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setUploaderSuppressDeletes: (BOOL)suppress)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setUploaderSimulate: (BOOL)simulate)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setUploaderIncludeSensitiveInfo: (BOOL)includeSensitiveInfo)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(setUploaderIncludeCFNetworkDiagnostics: (BOOL)includeCFNetworkDiagnostics)

RCT_EXTERN_METHOD(startUploadingHistorical)
RCT_EXTERN_METHOD(stopUploadingHistoricalAndReset)
RCT_EXTERN_METHOD(resetCurrentUploader)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(uploaderProgress)

@end
