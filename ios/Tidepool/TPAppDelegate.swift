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
import TPHealthKitUploader

var fileLogger: DDFileLogger!

class TPAppDelegate: EXStandaloneAppDelegate {
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        DDLogVerbose("trace")

        RollbarReactNative.initWithAccessToken("00788919100a467e8fb08144b427890e")
        TPSettings.sharedInstance.loadSettings()
        
        // Occasionally log full date to help with deciphering logs!
        let dateString = DateFormatter().isoStringFromDate(Date())
        DDLogVerbose("Log Date: \(dateString)")
        
        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

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
        // super.applicationProtectedDataWillBecomeUnavailable(application) // super doesn't implement!
    }
    
    override func applicationWillResignActive(_ application: UIApplication) {
        DDLogVerbose("trace")
        // super.applicationWillResignActive(application) // super doesn't implement!
    }

    override func applicationDidEnterBackground(_ application: UIApplication) {
        DDLogVerbose("trace")

        // Re-enable idle timer (screen locking) when the app enters background. (May have been disabled during sync/upload.)
        UIApplication.shared.isIdleTimerDisabled = false
        // TODO: health - need to disable idle timer while Initial or Manual Sync is going on (and also sync via Debug Health)

        // super.applicationDidEnterBackground(application) // super doesn't implement!
    }

    override func applicationWillEnterForeground(_ application: UIApplication) {
        DDLogInfo("applicationWillEnterForeground")
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
}
