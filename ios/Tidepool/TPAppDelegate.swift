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

import UIKit
import CocoaLumberjack
import Firebase
import MessageUI
import SwiftyJSON
import TPHealthKitUploader

var fileLogger: DDFileLogger!

class TPAppDelegate: EXStandaloneAppDelegate {
    fileprivate var registeredForReachability = false
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        DDLogVerbose("trace")

        if let path = Bundle.main.path(forResource: "Service-Info", ofType: "plist"), let serviceInfo = NSDictionary(contentsOfFile: path), let rollbarAccessToken =  serviceInfo["ROLLBAR_POST_CLIENT_TOKEN"] as? String {
            DDLogInfo("We have Service-Info!")
            RollbarReactNative.initWithAccessToken(rollbarAccessToken)
        } else {
            DDLogInfo("No Service-Info!")
        }

        if let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"), let googleServiceInfo = NSDictionary(contentsOfFile: path), let _ =  googleServiceInfo["GOOGLE_APP_ID"] as? String {
            DDLogInfo("We have GoogleService-Info!")
            
            // Do this after Rollbar init since we're using Firebase for crash reporting
            FirebaseApp.configure()
        } else {
            DDLogInfo("No GoogleService-Info!")
        }

        TPSettings.sharedInstance.loadSettings()

        if TPSettings.sharedInstance.includeCFNetworkDiagnostics {
            DDLogVerbose("Enabling CFNETWORK_DIAGNOSTICS")
            setenv("CFNETWORK_DIAGNOSTICS", "3", 1)
        } else {
            DDLogVerbose("Disabling CFNETWORK_DIAGNOSTICS")
            unsetenv("CFNETWORK_DIAGNOSTICS")
        }

        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

        let state = UIApplication.shared.applicationState
        if state == .background {
            // TODO: background uploader - If we fail to refresh token, should we use a local notification to prompt the user to bring the app to foreground and log in, to get new valid token?
            TPUploaderAPI.connector().showLocalNotificationDebug(title: "Launched in background", body: nil, sound: nil)
            backgroundRefreshTokenAndConfigureHealthKitInterface()
        } else {
            DDLogVerbose("Log Date: \(DateFormatter().isoStringFromDate(Date()))")
            TPDataController.sharedInstance.configureHealthKitInterface()
            if !registeredForReachability {
                registeredForReachability = true
                NotificationCenter.default.addObserver(self, selector: #selector(TPAppDelegate.reachabilityChanged(_:)), name: ReachabilityChangedNotification, object: nil)
            }
        }

        DDLogInfo("did finish launching")

        return result
    }

    override func applicationProtectedDataDidBecomeAvailable(_ application: UIApplication) {
        TPUploaderAPI.connector().uploader().applicationProtectedDataDidBecomeAvailable(application)
        // super.applicationProtectedDataDidBecomeAvailable(application) // super doesn't implement!
    }

    override func applicationProtectedDataWillBecomeUnavailable(_ application: UIApplication) {
        TPUploaderAPI.connector().uploader().applicationProtectedDataWillBecomeUnavailable(application)
        // super.applicationProtectedDataWillBecomeUnavailable(application) // super doesn't implement!
    }

    override func applicationWillResignActive(_ application: UIApplication) {
        DDLogVerbose("trace")
        // super.applicationWillResignActive(application) // super doesn't implement!
    }

    override func applicationDidEnterBackground(_ application: UIApplication) {
        TPUploaderAPI.connector().uploader().applicationDidEnterBackground(application)
        // super.applicationDidEnterBackground(application) // super doesn't implement!
    }

    override func applicationWillEnterForeground(_ application: UIApplication) {
        TPUploaderAPI.connector().uploader().applicationWillEnterForeground(application)
        super.applicationWillEnterForeground(application)
    }

    override func applicationDidBecomeActive(_ application: UIApplication) {
        TPUploaderAPI.connector().uploader().applicationDidBecomeActive(application)
        // super.applicationDidBecomeActive(application) // super doesn't implement!
    }

    override func applicationWillTerminate(_ application: UIApplication) {
        TPUploaderAPI.connector().uploader().applicationWillTerminate(application)
        // super.applicationWillTerminate(application) // super doesn't implement!
    }

    @objc func reachabilityChanged(_ note: Notification) {
        DispatchQueue.main.async {
            let connector = TPUploaderAPI.connector()
            let uploader = connector.uploader()
            if connector.isConnectedToNetwork() {
                if !uploader.isInterfaceOn() {
                    TPDataController.sharedInstance.configureHealthKitInterface()
                } else {
                    uploader.resumeUploadingIfResumableOrPending()
                }
            } else {
                let message = "Upload paused while offline."
                let error = NSError(domain: TPUploader.ErrorDomain, code: TPUploader.ErrorCodes.noNetwork.rawValue, userInfo: [NSLocalizedDescriptionKey: message])
                DDLogInfo(message)
                TPUploaderAPI.connector().uploader().stopUploading(reason: .error(error: error))
            }
        }
    }

    fileprivate func backgroundRefreshTokenAndConfigureHealthKitInterface() {
        let api = TPApi.sharedInstance
        if api.sessionToken != nil {
            // Do refresh token and configure in parallel for background launches since if we have a previous persistent auth token it is likely to still be valid (but we also want periodic refresh), and we want to get to the upload request as soon as possible in the limited time (less than 30s) that we have for background task

            // Configure HealthKit Interface
            TPDataController.sharedInstance.configureHealthKitInterface()

            api.refreshToken() { (succeeded, statusCode) in
                if succeeded {
                    TPUploaderAPI.connector().showLocalNotificationDebug(title: "Refresh token succeeded", body: "status code: \(statusCode)", sound: nil)

                    // Get auth user from AsyncStorage and update the sessionToken
                    let settings = TPSettings.sharedInstance
                    settings.getValuesForAyncStorageKeys(keys: [kAsyncStorageAuthUserKey]) { (values: [String?]) in
                        let authUserValue = values[0]!
                        var json = JSON.init(parseJSON: authUserValue)
                        json["sessionToken"].string = api.sessionToken
                        settings.setValuesForAyncStorageKeys(keyValuePairs: [
                            [kAsyncStorageAuthUserKey, json.rawString()!],
                        ])
                    }
                } else {
                    var sound: UNNotificationSound?
                    if #available(iOS 12.0, *) {
                        sound = UNNotificationSound.defaultCritical
                    }
                    TPUploaderAPI.connector().showLocalNotificationDebug(title: "Refresh token failed", body: "status code: \(statusCode)", sound: sound)
                }
            }
        }
    }
}
