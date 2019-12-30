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
import MessageUI
import SwiftyJSON
import TPHealthKitUploader

var fileLogger: DDFileLogger!

class TPAppDelegate: EXStandaloneAppDelegate {
    fileprivate var registeredForReachability = false
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        DDLogVerbose("trace")

        RollbarReactNative.initWithAccessToken("00788919100a467e8fb08144b427890e")
        TPSettings.sharedInstance.loadSettings()

        // Occasionally log full date to help with deciphering logs!
        let dateString = DateFormatter().isoStringFromDate(Date())
        DDLogVerbose("Log Date: \(dateString)")

        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

        let state = UIApplication.shared.applicationState
        if state == .background {
            DDLogInfo("launched in background")
            refreshTokenAndConfigureHealthKitInterface()
        } else {
            TPDataController.sharedInstance.configureHealthKitInterface()
            if !registeredForReachability {
                registeredForReachability = true
                NotificationCenter.default.addObserver(self, selector: #selector(TPAppDelegate.reachabilityChanged(_:)), name: ReachabilityChangedNotification, object: nil)
            }
        }

        DDLogInfo("did finish launching")

        return result
    }

    fileprivate var deviceIsLocked = false
    override func applicationProtectedDataDidBecomeAvailable(_ application: UIApplication) {
        DDLogInfo("Device unlocked!")
        deviceIsLocked = false
        // super.applicationProtectedDataDidBecomeAvailable(application) // super doesn't implement!
    }

    override func applicationProtectedDataWillBecomeUnavailable(_ application: UIApplication) {
        DDLogInfo("Device locked!")

        deviceIsLocked = true

        // Stop historical upload since Health data will become unavailable. (Will resume again when available.)
        let message = "Sync stopped after device was locked."
        let error = NSError(domain: "Tidepool", code: -1, userInfo: [NSLocalizedDescriptionKey: message])
        TPUploaderAPI.connector().uploader().stopUploading(mode: .HistoricalAll, reason: .error(error: error))

        // super.applicationProtectedDataWillBecomeUnavailable(application) // super doesn't implement!
    }

    override func applicationWillResignActive(_ application: UIApplication) {
        DDLogVerbose("trace")
        // super.applicationWillResignActive(application) // super doesn't implement!
    }

    override func applicationDidEnterBackground(_ application: UIApplication) {
        DDLogVerbose("trace")

        // Re-enable idle timer when the app enters background. (May have been disabled during historical sync/upload.)
        DDLogVerbose("applicationDidEnterBackground enable idle timer")
        UIApplication.shared.isIdleTimerDisabled = false

        // super.applicationDidEnterBackground(application) // super doesn't implement!
    }

    override func applicationWillEnterForeground(_ application: UIApplication) {
        DDLogInfo("applicationWillEnterForeground")

        // Disable idle timer if there is a historical sync in progress
        if TPUploaderAPI.connector().uploader().isUploadInProgressForMode(TPUploader.Mode.HistoricalAll) {
            DDLogVerbose("applicationWillEnterForeground disable idle timer")
            UIApplication.shared.isIdleTimerDisabled = true
        }

        let connector = TPUploaderAPI.connector()
        if connector.isConnectedToNetwork() {
            connector.uploader().resumeUploadingIfResumable()
        }

        super.applicationWillEnterForeground(application)
    }

    override func applicationDidBecomeActive(_ application: UIApplication) {
        // Occasionally log full date to help with deciphering logs!
        let dateString = DateFormatter().isoStringFromDate(Date())
        DDLogVerbose("Log Date: \(dateString)")

        // super.applicationDidBecomeActive(application) // super doesn't implement!
    }

    override func applicationWillTerminate(_ application: UIApplication) {
        DDLogVerbose("trace")
        // super.applicationWillTerminate(application) // super doesn't implement!
    }

    @objc func reachabilityChanged(_ note: Notification) {
        DispatchQueue.main.async {
            let connector = TPUploaderAPI.connector()
            if connector.isConnectedToNetwork() {
                DDLogInfo("Network is reachable, resume upload (if possible)")
                connector.uploader().resumeUploadingIfResumable()
            } else {
                let uploader = connector.uploader()
                if uploader.isUploadInProgressForMode(TPUploader.Mode.HistoricalAll) {
                    let message = "Unable to upload, not connected to network."
                    let error = NSError(domain: "Tidepool", code: -2, userInfo: [NSLocalizedDescriptionKey: message])
                    DDLogInfo(message)
                    TPUploaderAPI.connector().uploader().stopUploading(mode: .HistoricalAll, reason: .error(error: error))
                }
            }
        }
    }

    fileprivate func refreshTokenAndConfigureHealthKitInterface() {
        let api = TPApi.sharedInstance
        if api.sessionToken != nil {
            api.refreshToken() { (succeeded, statusCode) in
                if succeeded {
                    DDLogInfo("Refresh token succeeded, statusCode: \(statusCode)")

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

                    // Configure HealthKit Interface (uses new auth user, etc)
                    TPDataController.sharedInstance.configureHealthKitInterface()
                } else {
                    DDLogInfo("Refresh token failed, statusCode: \(statusCode)")
                }
            }
        }
    }
}
