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

import CocoaLumberjack
import UIKit

class TPDataController: NSObject
{
    static let sharedInstance = TPDataController()

    var currentUserId: String?
    var currentUserIsDSAUser: Bool
    var currentUserFullName: String?
    var bioSex: String? // biological sex is gleaned from HealthKit, and uploaded when missing in the service. // TODO: health - use this
    
    override private init() {
        currentUserIsDSAUser = false
    }
    
    /// Call this at login/logout, token refresh(?), and upon enabling or disabling the HealthKit interface
    func configureHealthKitInterface() {
        DDLogInfo("Configure HK interface, user id: \(String(describing: self.currentUserId)), full name: \(String(describing: self.currentUserFullName)), is DSA user: \(String(describing: self.currentUserIsDSAUser))")

        TPUploaderAPI.connector().uploader().configure()
    }
    
    /// Enables HealthKit for current viewable user
    ///
    /// Note: This sets the current tidepool user as the HealthKit user!
    func enableHealthKitInterfaceAndAuthorize() {
        DDLogInfo("trace")
        TPUploaderAPI.connector().uploader().enableHealthKitInterfaceAndAuthorize()
    }
    
    /// Disables HealthKit for current user
    ///
    /// Note: This does not NOT clear the current HealthKit user!
    func disableHealthKitInterface() {
        DDLogInfo("trace")
        TPUploaderAPI.connector().uploader().disableHealthKitInterface()
    }
}
