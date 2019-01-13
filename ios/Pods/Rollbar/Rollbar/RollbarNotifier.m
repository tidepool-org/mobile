//  Copyright (c) 2018 Rollbar, Inc. All rights reserved.

#import "RollbarNotifier.h"
#import "RollbarThread.h"
#import "RollbarFileReader.h"
#import "RollbarReachability.h"
#import "RollbarLogger.h"
#import <UIKit/UIKit.h>
#include <sys/utsname.h>
#import "NSJSONSerialization+Rollbar.h"
#import "KSCrash.h"
#import "RollbarTelemetry.h"
#import "RollbarPayloadTruncator.h"

#define MAX_PAYLOAD_SIZE 128 // The maximum payload size in kb

static NSString *QUEUED_ITEMS_FILE_NAME = @"rollbar.items";
static NSString *STATE_FILE_NAME = @"rollbar.state";

static NSUInteger MAX_RETRY_COUNT = 5;
static NSUInteger MAX_BATCH_SIZE = 1;

static NSString *queuedItemsFilePath = nil;
static NSString *stateFilePath = nil;
static NSMutableDictionary *queueState = nil;

static RollbarThread *rollbarThread = nil;
static RollbarReachability *reachability = nil;
static BOOL isNetworkReachable = YES;

#define IS_IOS7_OR_HIGHER (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_6_1)

@implementation RollbarNotifier

- (id)initWithAccessToken:(NSString*)accessToken
            configuration:(RollbarConfiguration*)configuration
                   isRoot:(BOOL)isRoot {

    if ((self = [super init])) {
        [self updateAccessToken:accessToken
                  configuration:configuration
                         isRoot:isRoot];

        if (isRoot) {
            NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory,
                                                                 NSUserDomainMask,
                                                                 YES);
            NSString *cachesDirectory =
                [paths objectAtIndex:0];
            queuedItemsFilePath =
                [cachesDirectory stringByAppendingPathComponent:QUEUED_ITEMS_FILE_NAME];
            stateFilePath =
                [cachesDirectory stringByAppendingPathComponent:STATE_FILE_NAME];

            if (![[NSFileManager defaultManager] fileExistsAtPath:queuedItemsFilePath]) {
                [[NSFileManager defaultManager] createFileAtPath:queuedItemsFilePath
                                                        contents:nil
                                                      attributes:nil];
            }

            if ([[NSFileManager defaultManager] fileExistsAtPath:stateFilePath]) {
                NSData *stateData = [NSData dataWithContentsOfFile:stateFilePath];
                if (stateData) {
                    NSDictionary *state = [NSJSONSerialization JSONObjectWithData:stateData
                                                                          options:0
                                                                            error:nil];
                    queueState = [state mutableCopy];
                } else {
                    RollbarLog(@"There was an error restoring saved queue state");
                }
            }
            if (!queueState) {
                queueState = [@{@"offset": [NSNumber numberWithUnsignedInt:0],
                                @"retry_count": [NSNumber numberWithUnsignedInt:0]} mutableCopy];
            }

            // Deals with sending items that have been queued up
            rollbarThread = [[RollbarThread alloc] initWithNotifier:self
                                               andWithReportingRate:configuration.maximumReportsPerMinute
                             ];
            [rollbarThread start];

            // Listen for reachability status
            // so that items are only sent when the internet is available
            reachability = [RollbarReachability reachabilityForInternetConnection];

            isNetworkReachable = [reachability isReachable];

            reachability.reachableBlock = ^(RollbarReachability*reach) {
                [self captureTelemetryDataForNetwork:true];
                isNetworkReachable = YES;
            };

            reachability.unreachableBlock = ^(RollbarReachability*reach) {
                [self captureTelemetryDataForNetwork:false];
                isNetworkReachable = NO;
            };

            [reachability startNotifier];
        }
    }

    return self;
}

- (void)logCrashReport:(NSString*)crashReport {
    NSDictionary *payload = [self buildPayloadWithLevel:self.configuration.crashLevel
                                                message:nil
                                              exception:nil
                                                  extra:nil
                                            crashReport:crashReport
                                                context:nil];
    if (payload) {
        [self queuePayload:payload];
    }
}

- (void)log:(NSString*)level
    message:(NSString*)message
  exception:(NSException*)exception
       data:(NSDictionary*)data
    context:(NSString*) context {
    
    if (!self.configuration.enabled) {
        return;
    }
    
    RollbarLevel rollbarLevel = RollbarLevelFromString(level);
    if (rollbarLevel < [self.configuration getRollbarLevel]) {
        return;
    }

    NSDictionary *payload = [self buildPayloadWithLevel:level
                                                message:message
                                              exception:exception
                                                  extra:data
                                            crashReport:nil
                                                context:context
                             ];
    if (payload) {
        [self queuePayload:payload];
    }
}

- (void)saveQueueState {
    NSError *error;
    NSData *data = [NSJSONSerialization dataWithJSONObject:queueState
                                                   options:0
                                                     error:&error
                                                      safe:true];
    if (error) {
        RollbarLog(@"Error: %@", [error localizedDescription]);
    }
    [data writeToFile:stateFilePath atomically:YES];
}


// Following commented out code attempts to get rid off batch processing of items completely:
//
//- (void)processSavedItems {
//    if (!isNetworkReachable) {
//        // Don't attempt sending if the network is known to be not reachable
//        return;
//    }
//
//    NSUInteger startOffset = [queueState[@"offset"] unsignedIntegerValue];
//    NSFileHandle *fileHandle = [NSFileHandle fileHandleForReadingAtPath:queuedItemsFilePath];
//    [fileHandle seekToEndOfFile];
//    __block unsigned long long fileLength = [fileHandle offsetInFile];
//    [fileHandle closeFile];
//
//    if (!fileLength) {
//        return;
//    }
//
//    // Empty out the queued item file if all items have been processed already
//    if (startOffset == fileLength) {
//        [@"" writeToFile:queuedItemsFilePath atomically:YES encoding:NSUTF8StringEncoding error:nil];
//
//        queueState[@"offset"] = [NSNumber numberWithUnsignedInteger:0];
//        queueState[@"retry_count"] = [NSNumber numberWithUnsignedInteger:0];
//        [self saveQueueState];
//
//        return;
//    }
//
//    // Iterate through the items file and send the items in batches.
//    RollbarFileReader *reader = [[RollbarFileReader alloc] initWithFilePath:queuedItemsFilePath
//                                                                  andOffset:startOffset];
//
//    NSMutableDictionary *payload = nil;
//    NSUInteger nextOffset = startOffset;
//    while (nextOffset < fileLength) {
//        NSString *payloadLine = [reader readLine];
//        nextOffset = [reader getCurrentOffset];
//        NSData *lineData = [payloadLine dataUsingEncoding:NSUTF8StringEncoding];
//        if (!lineData) {
//            // All we can do is ignore this line
//            RollbarLog(@"Error converting file line to NSData");
//            continue;
//        }
//        NSError *error;
//        payload = [NSJSONSerialization JSONObjectWithData:lineData
//                                                  options:(NSJSONReadingMutableContainers | NSJSONReadingMutableLeaves)
//                                                    error:&error];
//        if (!payload) {
//            // Ignore this line if it isn't valid json and proceed to the next line
//            RollbarLog(@"Error restoring data from file to JSON");
//            continue;
//        }
//
//    }
//
//    if(payload) {
//        [RollbarPayloadTruncator truncatePayload:payload];
//        BOOL shouldContinue = [self sendItem:payload withNextOffset:(nextOffset)];
//        if (!shouldContinue) {
//            // Stop processing the file so that the current file offset will be
//            // retried next time the file is processed
//            return;
//        }
//        // The file has had items added since we started iterating through it,
//        // update the known file length to equal the next offset
//        if (nextOffset > fileLength) {
//            fileLength = nextOffset;
//        }
//    }
//}
//
//- (BOOL)sendItem:(NSDictionary*)itemData
//  withNextOffset:(NSUInteger)nextOffset {
//
//    NSData *jsonPayload = [NSJSONSerialization dataWithJSONObject:itemData
//                                                          options:0 //NSJSONWritingPrettyPrinted
//                                                            error:nil
//                                                             safe:true];
//    BOOL success = [self sendPayload:jsonPayload];
//    if (!success) {
//        NSUInteger retryCount = [queueState[@"retry_count"] unsignedIntegerValue];
//
//        if (retryCount < MAX_RETRY_COUNT) {
//            queueState[@"retry_count"] = [NSNumber numberWithUnsignedInteger:retryCount + 1];
//            [self saveQueueState];
//
//            // Return NO so that the current batch will be retried next time
//            return NO;
//        }
//    }
//
//    queueState[@"offset"] = [NSNumber numberWithUnsignedInteger:nextOffset];
//    queueState[@"retry_count"] = [NSNumber numberWithUnsignedInteger:0];
//    [self saveQueueState];
//
//    return YES;
//}

- (void)processSavedItems {
    if (!isNetworkReachable) {
        // Don't attempt sending if the network is known to be not reachable
        return;
    }

    __block NSString *lastAccessToken = nil;
    NSMutableArray *items = [NSMutableArray array];

    NSUInteger startOffset = [queueState[@"offset"] unsignedIntegerValue];

    NSFileHandle *fileHandle = [NSFileHandle fileHandleForReadingAtPath:queuedItemsFilePath];
    [fileHandle seekToEndOfFile];
    __block unsigned long long fileLength = [fileHandle offsetInFile];
    [fileHandle closeFile];

    if (!fileLength) {
        return;
    }

    // Empty out the queued item file if all items have been processed already
    if (startOffset == fileLength) {
        [@"" writeToFile:queuedItemsFilePath atomically:YES encoding:NSUTF8StringEncoding error:nil];

        queueState[@"offset"] = [NSNumber numberWithUnsignedInteger:0];
        queueState[@"retry_count"] = [NSNumber numberWithUnsignedInteger:0];
        [self saveQueueState];

        return;
    }

    // Iterate through the items file and send the items in batches.
    RollbarFileReader *reader = [[RollbarFileReader alloc] initWithFilePath:queuedItemsFilePath
                                                                  andOffset:startOffset];
    [reader enumerateLinesUsingBlock:^(NSString *line, NSUInteger nextOffset, BOOL *stop) {
        NSData *lineData = [line dataUsingEncoding:NSUTF8StringEncoding];
        if (!lineData) {
            // All we can do is ignore this line
            RollbarLog(@"Error converting file line to NSData");
            return;
        }
        NSError *error;
        NSDictionary *payload = [NSJSONSerialization JSONObjectWithData:lineData
                                                                options:(NSJSONReadingMutableContainers | NSJSONReadingMutableLeaves)
                                                                  error:&error];

        if (!payload) {
            // Ignore this line if it isn't valid json and proceed to the next line
            RollbarLog(@"Error restoring data from file to JSON");
            return;
        }

        NSString *accessToken = payload[@"access_token"];

        // If the max batch size is reached as the file is being processed,
        // try sending the current batch before starting a new one
        if ([items count] >= MAX_BATCH_SIZE
            || (lastAccessToken != nil && [accessToken compare:lastAccessToken] != NSOrderedSame)) {
            BOOL shouldContinue = [self sendItems:items withAccessToken:lastAccessToken nextOffset:nextOffset];

            if (!shouldContinue) {
                // Stop processing the file so that the current file offset will be
                // retried next time the file is processed
                *stop = YES;
                return;
            }

            // The file has had items added since we started iterating through it,
            // update the known file length to equal the next offset
            if (nextOffset > fileLength) {
                fileLength = nextOffset;
            }

            [items removeAllObjects];
        }
        [items addObject:payload[@"data"]];

        lastAccessToken = accessToken;
    }];

    // The whole file has been read, send all of the pending items
    if ([items count]) {
        [self sendItems:items withAccessToken:lastAccessToken nextOffset:(NSUInteger)fileLength];
    }
}

- (NSDictionary*)buildPersonData {
    NSMutableDictionary *personData = [NSMutableDictionary dictionary];
    
    if (self.configuration.personId) {
        personData[@"id"] = self.configuration.personId;
    }
    if (self.configuration.personUsername) {
        personData[@"username"] = self.configuration.personUsername;
    }
    if (self.configuration.personEmail) {
        personData[@"email"] = self.configuration.personEmail;
    }
    
    if ([[personData allKeys] count]) {
        return personData;
    }
    
    return nil;
}

- (NSDictionary*)buildOptionalData {
    NSMutableDictionary *data = [NSMutableDictionary dictionary];

    // Add client/server linking ID
    if (self.configuration.requestId) {
        [data setObject:self.configuration.requestId forKey:@"requestId"];
    }

    // Add server data
    NSDictionary *serverData = [self buildServerData];

    if (serverData) {
        [data setObject:serverData forKey:@"server"];
    }

    if ([[data allKeys] count]) {
        return data;
    }

    return nil;
}

- (NSDictionary*)buildServerData {
    NSMutableDictionary *data = [NSMutableDictionary dictionary];

    if (self.configuration.serverHost) {
        data[@"host"] = self.configuration.serverHost;
    }
    if (self.configuration.serverRoot) {
        data[@"root"] = self.configuration.serverRoot;
    }
    if (self.configuration.serverBranch) {
        data[@"branch"] = self.configuration.serverBranch;
    }
    if (self.configuration.serverCodeVersion) {
        data[@"code_version"] = self.configuration.serverCodeVersion;
    }

    if ([[data allKeys] count]) {
        return data;
    }

    return nil;
}

- (NSDictionary*)buildClientData {
    NSNumber *timestamp = [NSNumber numberWithInteger:[[NSDate date] timeIntervalSince1970]]
    ;
    NSBundle *mainBundle = [NSBundle mainBundle];
    
    NSString *version = [mainBundle objectForInfoDictionaryKey:(NSString*)kCFBundleVersionKey];
    NSString *shortVersion = [mainBundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    NSString *bundleName = [mainBundle objectForInfoDictionaryKey:(NSString *)kCFBundleNameKey];
    NSString *bundleIdentifier = [mainBundle objectForInfoDictionaryKey:(NSString *)kCFBundleIdentifierKey];
    
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceCode = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    
    NSDictionary *iosData = @{@"ios_version": [[UIDevice currentDevice] systemVersion],
                              @"device_code": deviceCode,
                              @"code_version": version ? version : @"",
                              @"short_version": shortVersion ? shortVersion : @"",
                              @"bundle_identifier": bundleIdentifier ? bundleIdentifier : @"",
                              @"app_name": bundleName ? bundleName : @""};

    if (self.configuration.captureIp == CaptureIpFull) {
        return @{@"timestamp": timestamp,
                 @"ios": iosData,
                 @"user_ip": @"$remote_ip"};
    } else if (self.configuration.captureIp == CaptureIpAnonymize) {
        return @{@"timestamp": timestamp,
                 @"ios": iosData,
                 @"user_ip": @"$remote_ip_anonymize"};
    } else {
        return @{@"timestamp": timestamp,
                 @"ios": iosData};
    }
}

- (NSDictionary*)buildPayloadWithLevel:(NSString*)level
                               message:(NSString*)message
                             exception:(NSException*)exception
                                 extra:(NSDictionary*)extra
                           crashReport:(NSString*)crashReport
                               context:(NSString*)context {
    
    NSDictionary *clientData = [self buildClientData];
    NSDictionary *notifierData = @{@"name": self.configuration.notifierName,
                                   @"version": self.configuration.notifierVersion};
    
    NSMutableDictionary *customData =
        [NSMutableDictionary dictionaryWithDictionary:self.configuration.customData];
    if (crashReport || exception) {
        // neither crash report no exception payload objects have placeholders for any extra data
        // or an extra message, let's preserve them as the custom data:
        if (extra) {
            customData[@"error.extra"] = extra;
        }
        if (message && message.length > 0) {
            customData[@"error.message"] = message;
        }
    }

    NSDictionary *body = [self buildPayloadBodyWithMessage:message
                                                 exception:exception
                                                     extra:extra
                                               crashReport:crashReport
                          ];
    
    NSMutableDictionary *data = [@{@"environment": self.configuration.environment,
                                   @"level": level,
                                   @"language": @"objective-c",
                                   @"framework": self.configuration.framework,
                                   @"platform": @"ios",
                                   @"uuid": [self generateUUID],
                                   @"client": clientData,
                                   @"notifier": notifierData,
                                   @"custom": customData,
                                   @"body": body} mutableCopy];
    
    NSDictionary *personData = [self buildPersonData];
    
    if (personData) {
        data[@"person"] = personData;
    }

    NSDictionary *optionalData = [self buildOptionalData];

    if (optionalData) {
        [data addEntriesFromDictionary:optionalData];
    }

    if (context) {
        data[@"context"] = context;
    }

    // Transform payload, if necessary
    [self modifyPayload:data];
    [self scrubPayload:data];
    if ([self shouldIgnorePayload:data]) {
        return nil;
    }

    return @{@"access_token": self.configuration.accessToken,
             @"data": data};
}

- (NSDictionary*)buildPayloadBodyWithCrashReport:(NSString*)crashReport {
    return @{@"crash_report": @{@"raw": crashReport}};
}

- (NSDictionary*)buildPayloadBodyWithMessage:(NSString*)message
                                       extra:(NSDictionary*)extra {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    result[@"body"] = message ? message : @"";
    
    if (extra) {
        result[@"extra"] = extra;
    }
    
    return @{@"message": result};
}

- (NSDictionary*)buildPayloadBodyWithException:(NSException*)exception {

    NSMutableDictionary *exceptionInfo = [[NSMutableDictionary alloc] init];
    [exceptionInfo setObject:NSStringFromClass([exception class]) forKey:@"class"];
    [exceptionInfo setObject:[exception.reason mutableCopy] forKey:@"message"];
    [exceptionInfo setObject:[exception.description mutableCopy] forKey:@"description"];

    NSMutableArray *frames = [NSMutableArray array];
    for (NSString *line in exception.callStackSymbols) {
        NSMutableArray *components =  [NSMutableArray arrayWithArray:[line componentsSeparatedByCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@" "]]];
        [components removeObject:@""];
        [components removeObjectAtIndex:0];
        if (components.count >= 4) {
            NSString *method = [self methodNameFromStackTrace:components];
            NSString *filename = [components componentsJoinedByString:@" "];
            [frames addObject:@{@"library": components[0], @"filename": filename, @"address": components[1], @"lineno": components[components.count-1], @"method": method}];
        }
    }
    
    return @{@"trace": @{@"frames": frames, @"exception": exceptionInfo}};
}

- (NSString*)methodNameFromStackTrace:(NSArray*)stackTraceComponents {
    int start = false;
    NSString *buf;
    for (NSString *component in stackTraceComponents) {
        if (!start && [component hasPrefix:@"0x"]) {
            start = true;
        } else if (start && [component isEqualToString:@"+"]) {
            break;
        } else if (start) {
            buf = buf ? [NSString stringWithFormat:@"%@ %@", buf, component] : component;
        }
    }
    return buf ? buf : @"Unknown";
}

- (NSDictionary*)buildPayloadBodyWithMessage:(NSString*)message
                                   exception:(NSException*)exception
                                       extra:(NSDictionary*)extra
                                 crashReport:(NSString*)crashReport {
    NSDictionary *payloadBody;
    if (crashReport) {
        payloadBody = [self buildPayloadBodyWithCrashReport:crashReport];
    } else if (exception) {
        payloadBody = [self buildPayloadBodyWithException:exception];
    } else {
        payloadBody = [self buildPayloadBodyWithMessage:message extra:extra];
    }
    
    NSArray *telemetryData = [[RollbarTelemetry sharedInstance] getAllData];
    if (payloadBody && telemetryData.count > 0) {
        NSMutableDictionary *newPayloadBody = nil;
        newPayloadBody = [NSMutableDictionary dictionaryWithDictionary:payloadBody];
        [newPayloadBody setObject:telemetryData forKey:@"telemetry"];
        return newPayloadBody;
    }
    
    return payloadBody;
}

- (void)queuePayload:(NSDictionary*)payload {
    [self performSelector:@selector(queuePayload_OnlyCallOnThread:)
                 onThread:rollbarThread
               withObject:payload
            waitUntilDone:NO
     ];
}

- (void)queuePayload_OnlyCallOnThread:(NSDictionary *)payload {
    NSFileHandle *fileHandle = [NSFileHandle fileHandleForWritingAtPath:queuedItemsFilePath];
    [fileHandle seekToEndOfFile];
    [fileHandle writeData:[NSJSONSerialization dataWithJSONObject:payload options:0 error:nil safe:true]];
    [fileHandle writeData:[@"\n" dataUsingEncoding:NSUTF8StringEncoding]];
    [fileHandle closeFile];
    [[RollbarTelemetry sharedInstance] clearAllData];
}

- (BOOL)sendItems:(NSArray*)itemData
  withAccessToken:(NSString*)accessToken
       nextOffset:(NSUInteger)nextOffset {
    
    NSMutableArray *payloadItems = [NSMutableArray array];
    for (NSDictionary *item in itemData) {
        NSMutableDictionary *newItem = [NSMutableDictionary dictionaryWithDictionary:item];
        [RollbarPayloadTruncator truncatePayload:newItem];
        [payloadItems addObject:newItem];
    }
    NSMutableDictionary *newPayload =
        [NSMutableDictionary dictionaryWithDictionary:@{@"access_token": accessToken,
                                                        @"data": payloadItems}
         ];
    if ([payloadItems count] > 1) {
        // we want multiple items peayload to also be below truncation threashold
        // so it can be successfully sent via HTTP POST:
        [RollbarPayloadTruncator truncatePayload:newPayload];
    }

    NSData *jsonPayload = [NSJSONSerialization dataWithJSONObject:newPayload
                                                          options:NSJSONWritingPrettyPrinted
                                                            error:nil
                                                             safe:true];
    
    BOOL success = [self sendPayload:jsonPayload];
    if (!success) {
        NSUInteger retryCount = [queueState[@"retry_count"] unsignedIntegerValue];
        
        if (retryCount < MAX_RETRY_COUNT) {
            queueState[@"retry_count"] = [NSNumber numberWithUnsignedInteger:retryCount + 1];
            [self saveQueueState];
            
            // Return NO so that the current batch will be retried next time
            return NO;
        }
    }
    
    queueState[@"offset"] = [NSNumber numberWithUnsignedInteger:nextOffset];
    queueState[@"retry_count"] = [NSNumber numberWithUnsignedInteger:0];
    [self saveQueueState];
    
    return YES;
}

- (BOOL)sendPayload:(NSData*)payload {
    NSURL *url = [NSURL URLWithString:self.configuration.endpoint];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:self.configuration.accessToken forHTTPHeaderField:@"X-Rollbar-Access-Token"];
    [request setHTTPBody:payload];

    __block BOOL result = NO;
    if (IS_IOS7_OR_HIGHER) {
        // This requires iOS 7.0+
        dispatch_semaphore_t sem = dispatch_semaphore_create(0);
        
        NSURLSession *session = [NSURLSession sharedSession];
        
        if (self.configuration.httpProxyEnabled
            || self.configuration.httpsProxyEnabled) {
            
            NSDictionary *connectionProxyDictionary =
            @{
              @"HTTPEnable"   : [NSNumber numberWithInt:self.configuration.httpProxyEnabled],
              @"HTTPProxy"    : self.configuration.httpProxy,
              @"HTTPPort"     : self.configuration.httpProxyPort,
              @"HTTPSEnable"  : [NSNumber numberWithInt:self.configuration.httpsProxyEnabled],
              @"HTTPSProxy"   : self.configuration.httpsProxy,
              @"HTTPSPort"    : self.configuration.httpsProxyPort
              };

            NSURLSessionConfiguration *sessionConfig =
            [NSURLSessionConfiguration ephemeralSessionConfiguration];
            sessionConfig.connectionProxyDictionary = connectionProxyDictionary;
            session = [NSURLSession sessionWithConfiguration:sessionConfig];
        }
        
        NSURLSessionDataTask *dataTask =
            [session dataTaskWithRequest:request
                       completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
                result = [self checkPayloadResponse:response error:error data:data];
                dispatch_semaphore_signal(sem);
            }];
        [dataTask resume];
        
        dispatch_semaphore_wait(sem, DISPATCH_TIME_FOREVER);
    } else {
        // Using method sendSynchronousRequest, deprecated since iOS 9.0
        NSError *error;
        NSHTTPURLResponse *response;
        NSData *data = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        result = [self checkPayloadResponse:response error:error data:data];
    }
    
    return result;
}

- (BOOL)checkPayloadResponse:(NSURLResponse*)response
                       error:(NSError*)error
                        data:(NSData*)data {
    if (error) {
        RollbarLog(@"There was an error reporting to Rollbar");
        RollbarLog(@"Error: %@", [error localizedDescription]);
    } else {
        NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*)response;
        if ([httpResponse statusCode] == 200) {
            RollbarLog(@"Success");
            return YES;
        } else {
            RollbarLog(@"There was a problem reporting to Rollbar");
            if (data) {
                RollbarLog(@"Response: %@", [NSJSONSerialization JSONObjectWithData:data options:0 error:nil]);
            }
        }
    }
    return NO;
}

- (NSString*)generateUUID {
    CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
    NSString *string = (__bridge_transfer NSString*)CFUUIDCreateString(kCFAllocatorDefault, uuid);
    CFRelease(uuid);
    return string;
}

#pragma mark - Payload truncate

- (void)createMutablePayloadWithData:(NSMutableDictionary *)data
                             forPath:(NSString *)path {
    NSArray *pathComponents = [path componentsSeparatedByString:@"."];
    NSString *currentPath = @"";

    for (int i=0; i<pathComponents.count; i++) {
        NSString *part = pathComponents[i];
        currentPath = i == 0 ? part : [NSString stringWithFormat:@"%@.%@", currentPath, part];
        id val = [data valueForKeyPath:currentPath];
        if (!val) return;
        if ([val isKindOfClass:[NSArray class]] && ![val isKindOfClass:[NSMutableArray class]]) {
            NSMutableArray *newVal = [NSMutableArray arrayWithArray:val];
            [data setValue:newVal forKeyPath:currentPath];
        } else if ([val isKindOfClass:[NSDictionary class]] && ![val isKindOfClass:[NSMutableDictionary class]]) {
            NSMutableDictionary *newVal = [NSMutableDictionary dictionaryWithDictionary:val];
            [data setValue:newVal forKeyPath:currentPath];
        }
    }
}

#pragma mark - Payload transformations

// Run data through custom payload modification method if available
- (void)modifyPayload:(NSMutableDictionary *)data {
    if (self.configuration.payloadModification) {
        self.configuration.payloadModification(data);
    }
}

// Determine if this payload should be ignored
- (BOOL)shouldIgnorePayload:(NSDictionary*)data {
    BOOL shouldIgnore = false;

    if (self.configuration.checkIgnore) {
        @try {
            shouldIgnore = self.configuration.checkIgnore(data);
        } @catch(NSException *e) {
            RollbarLog(@"checkIgnore error: %@", e.reason);

            // Remove checkIgnore to prevent future exceptions
            [self.configuration setCheckIgnoreBlock:nil];
        }
    }

    return shouldIgnore;
}

// Scrub specified fields from payload
- (void)scrubPayload:(NSMutableDictionary*)data {

    if (self.configuration.scrubFields.count == 0) {
        return;
    }

    NSMutableSet *actualFieldsToScrub = self.configuration.scrubFields;
    if (self.configuration.scrubWhitelistFields.count > 0) {
        // actualFieldsToScrub =
        // self.configuration.scrubFields - self.configuration.scrubWhitelistFields
        // while using case insensitive field name comparison:
        actualFieldsToScrub = [NSMutableSet new];
        for(NSString *key in self.configuration.scrubFields) {
            BOOL isWhitelisted = false;
            for (NSString *whiteKey in self.configuration.scrubWhitelistFields) {
                if (NSOrderedSame == [key caseInsensitiveCompare:whiteKey]) {
                    isWhitelisted = true;
                }
            }
            if (!isWhitelisted) {
                [actualFieldsToScrub addObject:key];
            }
        }
    }
    
    for (NSString *key in actualFieldsToScrub) {
        if ([data valueForKeyPath:key]) {
            [self createMutablePayloadWithData:data forPath:key];
            [data setValue:@"*****" forKeyPath:key];
        }
    }
}

#pragma mark - Update configuration methods

- (void)updateAccessToken:(NSString*)accessToken
            configuration:(RollbarConfiguration *)configuration
                   isRoot:(BOOL)isRoot {
    if (configuration) {
        self.configuration = configuration;
    } else {
        self.configuration = [RollbarConfiguration configuration];
    }

    [self updateAccessToken:accessToken];

    if (isRoot) {
        [self.configuration _setRoot];
    }
}

- (void)updateConfiguration:(RollbarConfiguration *)configuration isRoot:(BOOL)isRoot {
    NSString *currentAccessToken = self.configuration.accessToken;
    [self updateAccessToken:currentAccessToken configuration:configuration isRoot:isRoot];
}

- (void)updateAccessToken:(NSString*)accessToken {
    self.configuration.accessToken = accessToken;
}

- (void)updateReportingRate:(NSUInteger)maximumReportsPerMinute {
    if (nil != self.configuration) {
        [self.configuration setReportingRate:maximumReportsPerMinute];
    }
    if (nil != rollbarThread) {
        [rollbarThread cancel];
        rollbarThread = [[RollbarThread alloc] initWithNotifier:self
                                           andWithReportingRate:maximumReportsPerMinute
                         ];
        [rollbarThread start];
    }
}
#pragma mark - Network telemetry data

- (void)captureTelemetryDataForNetwork:(BOOL)reachable {
    if (self.configuration.shouldCaptureConnectivity && isNetworkReachable != reachable) {
        NSString *status = reachable ? @"Connected" : @"Disconnected";
        NSString *networkType = @"Unknown";
        NetworkStatus networkStatus = [reachability currentReachabilityStatus];
        if (networkStatus == ReachableViaWiFi) {
            networkType = @"WiFi";
        }
        else if (networkStatus == ReachableViaWWAN) {
            networkType = @"Cellular";
        }
        [[RollbarTelemetry sharedInstance] recordConnectivityEventForLevel:RollbarWarning
                                                                    status:status
                                                                 extraData:@{@"network": networkType}
         ];
    }
}

// THIS IS ONLY FOR TESTS, DO NOT ACTUALLY USE THIS METHOD, HENCE BEING "PRIVATE"
- (NSThread *)_rollbarThread {
    return rollbarThread;
}

- (void)_test_doNothing {}

@end
