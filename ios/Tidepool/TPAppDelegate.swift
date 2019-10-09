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

var fileLogger: DDFileLogger!

class TPAppDelegate: EXStandaloneAppDelegate {
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        DDLogVerbose("trace")

        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

        RollbarReactNative.initWithAccessToken("00788919100a467e8fb08144b427890e")
        TPSettings.sharedInstance.loadSettings()
        
        return result
    }
}
